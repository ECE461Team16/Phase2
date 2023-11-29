import { exec } from 'child_process';

export const handler = async (event, context) => {
    const url = JSON.parse(JSON.stringify(event)).URL;

    try {
        exec('rm -rf /tmp/*', (error, stdout, stderr) => {  //remove /tmp file
            if (error) {
              console.error(`exec error: ${error}`);
            }
          });

        // Construct the command to run the Bash script
        const command = `./run URL_FILE ${url}`;

        // Variable to store the output
        let scriptOutput = '';
        // Execute the command
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running Bash script:', error);
                return context.fail('Error running Bash script');
            } else {
                // Capture the output
                scriptOutput = stdout;

                console.log('Bash script output:', scriptOutput);
                // return scriptOutput;
            }
        });
        // // Log the script output as it happens
        // childProcess.stdout?.on('data', (data) => {
        //     console.log('Bash script output:', data);
        // });

        // childProcess.stderr?.on('data', (data) => {
        //     console.error('Bash script error:', data);
        // });

        // // Optionally, wait for the process to exit
        // await new Promise((resolve) => {
        //     childProcess.on('exit', () => {
        //         resolve();
        //     });
        // });
        
        // Return the output as part of the response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Bash script executed successfully', output: scriptOutput }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
