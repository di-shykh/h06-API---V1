import jwt from 'jsonwebtoken';

export const jwtService ={
    async createToken (userId: string): Promise<string> {
        const secret: string = process.env.JWT_SECRET as string;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const token: string = jwt.sign({ userId }, secret, { expiresIn: '1h' });
        return token;
    },
    async decodeToken(token: string): Promise<any> {
        try{
            return jwt.decode(token);
        } catch (e) {
            console.error("Can't decode token",e);
            return null;
        }
    },
    async verifyToken(token: string): Promise<{ userId: string }|null> {
        try {
            return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        } catch (e) {
            console.error("Can't verify token",e);
            return null;
        }
    }
}

