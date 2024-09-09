const Imap = require('imap');
const { simpleParser } = require('mailparser');

const readMail = (folderName, searchTerm) => {
    return new Promise((resolve, reject) => {
        const imap = new Imap({
            user: 'ansari.aman020404@gmail.com',
            password: 'kuhtbgumljyvgjym',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        });

        imap.once('ready', () => {
            imap.openBox(folderName, true, (err) => {
                if (err) return reject(err);

                imap.search(['UNSEEN'], (err, results) => {
                    if (err) return reject(err);

                    if (results.length === 0) {
                        resolve('No new emails in this folder');
                        return imap.end();
                    }

                    results.sort((a, b) => b - a)

                    const emails = [];
                    const f = imap.fetch(results, { bodies: '' });

                    f.on('message', (msg) => {
                        msg.on('body', (stream) => {
                            simpleParser(stream, (err, email) => {
                                if (err) return reject(err);
                                if (email.subject.includes(searchTerm)) {
                                    emails.push({
                                        subject: email.subject,
                                        from: email.from.text,
                                        text: email.text,
                                    });
                                }
                            });
                        });
                    });

                    f.once('end', () => {
                        imap.end();
                        resolve(emails);
                    });
                });
            });
        });

        imap.once('error', (err) => {
            reject(err);
        });

        imap.connect();
    });
};

module.exports = readMail;
