import express, {Request, Response} from 'express';
import Mollie from './../dist/Mollie';
import {promises} from "fs";
import {join} from "path";
// @ts-ignore
import swaggerUI from 'swagger-ui-express';

if (!process.env.MOLLIE_KEY) {
    throw new Error('Please add your mollie (test) API key to the env. E.g. MOLLIE_KEY=test_xxxxxxxxxx npx ts-node examples/server.ts');
    process.exit(1);
}

const mollie = new Mollie(process.env.MOLLIE_KEY!);

const app = express();

app.get('/payments/list', async (req: Request, res: Response) => {
    const result = await mollie.payments.list();
    res.send(result);
});

app.get('/methods/list', async (req: Request, res: Response) => {
    const result = await mollie.methods.list();
    res.send(result);
});

app.get('/methods/list/all', async(req:Request, res: Response) => {
    const result = await mollie.methods.listAll();
    res.send(result);
});

app.use('/docs', swaggerUI.serve, async (req: Request, res: Response) => {
    const swaggerDocStr = await promises.readFile(join(__dirname, 'swagger.json'), 'utf-8');
    const swaggerDoc = JSON.parse(swaggerDocStr);
    swaggerUI.setup(swaggerDoc)(req, res);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
