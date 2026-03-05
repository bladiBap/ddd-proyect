import { Request, Response, NextFunction } from 'express';
import { constants } from '@common/Constants/Constants';
import jwt from 'jsonwebtoken';

export function validateToken (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: 'Acceso denegado. No se proporcionó un token Bearer.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, constants.JWT.SECRET, {
            issuer: constants.JWT.ISSUER,
            audience: constants.JWT.AUDIENCE === '*' ? undefined : constants.JWT.AUDIENCE
        });

        (req as any).user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ 
            message: 'Token inválido o expirado.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};