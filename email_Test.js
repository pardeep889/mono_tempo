const { EmailClient } = require("@azure/communication-email");

// This code retrieves your connection string from an environment variable.
const connectionString = "endpoint=https://tempo-rg-email-resource.unitedstates.communication.azure.com/;accesskey=5WkYMdbgRrL8VN4JcDZkR7gtjsvFEBsZzd+yQ2sz0luEui3QTpekPrBkD3heIqEVQQRbBDM/Fn+sZd1VUqjc/w==";
const client = new EmailClient(connectionString);

async function main() {
    const emailMessage = {
        senderAddress: "DoNotReply@tempospace.co",
        content: {
            subject: "Test Email",
            plainText: "Hello world via email.",
        },
        recipients: {
            to: [{ address: "pardeep889@hotmail.com" }],
        },
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
}

main();
