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
        // Construct the command to run the Bash script
        const command = `./run URL_FILE ${url}`;

        // Variable to store the output
        let scriptOutput = '';

        // Execute the command
        const { stdout, stderr } = await execAsync(command);

        // Capture the output
        scriptOutput = stdout;

        console.log('Bash script output:', scriptOutput);

        // Return the output as part of the response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Bash script executed successfully', output: scriptOutput }),
        };
    } catch (error) {
        console.error('Error running Bash script:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
