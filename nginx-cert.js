const { execSync } = require("child_process")
const { writeFileSync, readFileSync, existsSync } = require("fs")

const sitesAvailableDIR = "/etc/nginx/sites-available"
const sitesEnabledDIR = "/etc/nginx/sites-enabled"

const nginxCert = () => {
    try {
        const args = process.argv.slice(2)
        const domain = args[0]

        const defaultServerConfig = readFileSync("./default-server-config", "utf-8")

        const domainDefaultServerConfig = defaultServerConfig.replaceAll(/<domain>/g, domain)

        if(!existsSync(sitesAvailableDIR)) {
            throw new Error(`Forlder ${sitesAvailableDIR} does not exist`)
        }

        if(!existsSync(sitesEnabledDIR)) {
            throw new Error(`Forlder ${sitesEnabledDIR} does not exist`)
        }

        writeFileSync(`${sitesAvailableDIR}/${domain}`, domainDefaultServerConfig, "utf-8")
        execSync(`ln -s ${sitesAvailableDIR}/${domain} ${sitesEnabledDIR}`)
        execSync(`ufw allow 'Nginx HTTP'`)
        execSync(`certbot certonly --standalone -d ${domain}`)
    } catch (e) {
        console.log(e.stack)
    }
}

nginxCert()