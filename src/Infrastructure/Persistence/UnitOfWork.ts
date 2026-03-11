import { injectable, inject } from 'tsyringe';
import { EntityManager, QueryRunner, DataSource } from 'typeorm';

import { DomainEvent } from '@common/Core/Abstractions/DomainEvent';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';
import { IEntityManagerProvider } from '@common/Core/Abstractions/IEntityManagerProvider';

import { Mediator } from '@/Common/Mediator/Mediator';
import { DomainEventsCollector } from '@application/DomainEventsCollector';
import { IOutboxDatabase } from '@outbox/Repository/IOutboxDatabase';

@injectable()
export class UnitOfWork implements IUnitOfWork, IEntityManagerProvider, IOutboxDatabase {
	private queryRunner?: QueryRunner;
	private manager?: EntityManager;
	private isActive = false;
	private count = 0;

	constructor(
        @inject(Mediator) private readonly mediator: Mediator,
        @inject('DataSource') private readonly dataSource: DataSource
	) {}

	async startTransaction(): Promise<void> {
		if (this.isActive) {
			throw new Error('UnitOfWork: the transaction is already active.');
		}
		this.count += 1;
		const qr = this.dataSource.createQueryRunner();
		await qr.connect();
		await qr.startTransaction();

		this.queryRunner = qr;
		this.manager = qr.manager;
		this.isActive = true;
	}

	async commit(): Promise<void> {
		if (!this.isActive || !this.queryRunner) {
			throw new Error('UnitOfWork: no active transaction to commit.');
		}

		const domainEvents = this.extractDomainEvents();

		for (const event of domainEvents) {
			await this.mediator.publish(event);
		}
        
		try {
			await this.queryRunner.commitTransaction();
		} catch (err) {
			try { 
				await this.queryRunner.rollbackTransaction(); 
			} catch {
				console.error('UnitOfWork: failed to rollback transaction after commit failure.', err);
			}
			throw err;
		} finally {
			await this.safeRelease();
		}
	}

	async rollback(): Promise<void> {
		if (!this.isActive || !this.queryRunner) {
			return;
		}
		try {
			await this.queryRunner.rollbackTransaction();
		} finally {
			await this.safeRelease();
		}
	}

	private extractDomainEvents(): DomainEvent[] {
		return DomainEventsCollector.pullAll();
	}

	private async safeRelease(): Promise<void> {
		try {
			if (this.queryRunner && !this.queryRunner.isReleased) {
				await this.queryRunner.release();
			}
		} finally {
			this.queryRunner = undefined;
			this.manager = undefined;
			this.isActive = false;
		}
	}

	getManager(): EntityManager {
		return this.manager ?? this.dataSource.manager;
	}
}
