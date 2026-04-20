import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { TypeormInstrumentation } from '@opentelemetry/instrumentation-typeorm';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const otelDisabled = process.env.OTEL_SDK_DISABLED === 'true';

if (!otelDisabled) {
	if (process.env.OTEL_DIAGNOSTIC_LOG_LEVEL === 'debug') {
		diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
	}

	const traceExporter = new OTLPTraceExporter({
		url:
			process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
			'http://localhost:4318/v1/traces',
	});

	const sdk = new NodeSDK({
		resource: resourceFromAttributes({
			[SemanticResourceAttributes.SERVICE_NAME]:
				process.env.OTEL_SERVICE_NAME || 'ms-kitchen-api',
			[SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
				process.env.NODE_ENV || 'development',
		}),
		traceExporter,
		instrumentations: [
			getNodeAutoInstrumentations(),
			new TypeormInstrumentation(),
		],
	});

	const startTelemetry = async () => {
		try {
			await sdk.start();
			console.log('OpenTelemetry initialized');
		} catch (error) {
			console.error('Failed to initialize OpenTelemetry', error);
		}
	};

	startTelemetry();

	const shutdownTelemetry = async () => {
		try {
			await sdk.shutdown();
			console.log('OpenTelemetry terminated');
		} catch (error) {
			console.error('Error terminating OpenTelemetry', error);
		}
	};

	process.once('SIGTERM', shutdownTelemetry);
	process.once('SIGINT', shutdownTelemetry);
}