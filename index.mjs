import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export const handler = async (event, context) => {
    const url = JSON.parse(JSON.stringify(event)).URL;

    try {
        // Asynchronously remove files in /tmp directory
        await execAsync('rm -rf /tmp/*');
    } catch (error) {
        console.error('Error removing files in /tmp:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }

    try {
        const command = `./run URL_FILE ${url}`;
        let scriptOutput = '';
        const { stdout, stderr } = await execAsync(command);

        scriptOutput = stdout;

        console.log('Bash script output:', scriptOutput);

        return {
            statusCode: 200,
            body: scriptOutput,
        };
    } catch (error) {
        console.error('Error running Bash script:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
