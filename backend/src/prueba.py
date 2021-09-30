# import necessary packages
 
import email.message
import smtplib
 
# create message object instance

def enviar_email(correo, ecopuntos):
    email_content = """
    <html>

    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <style type="text/css">
            body,
            table,
            td,
            a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }

            table,
            td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }

            img {
                -ms-interpolation-mode: bicubic;
            }

            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }

            table {
                border-collapse: collapse !important;
            }

            body {
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }

            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }

            @media screen and (max-width: 480px) {
                .mobile-hide {
                    display: none !important;
                }

                .mobile-center {
                    text-align: center !important;
                }
            }

            div[style*="margin: 16px 0;"] {
                margin: 0 !important;
            }
        </style>

    <body style="margin: 0 !important; padding: 0 !important; background-color: #eeeeee;" bgcolor="#eeeeee">
       Se te han acreditado %s ecopuntos
    </body>

    </html>
    
    """ % (ecopuntos)
    
    # setup the parameters of the message
    msg = email.message.Message()
    password = "5019202501"
    msg['From'] = "jamil.torres98@gmail.com"
    msg['To'] = correo
    msg['Subject'] = "Subscription"
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(email_content)
    # add in the message body

    
    #create server
    server = smtplib.SMTP('smtp.gmail.com: 587')
    
    server.starttls()
    
    # Login Credentials for sending the mail
    server.login(msg['From'], password)
    
    
    # send the message via the server.
    server.sendmail(msg['From'], msg['To'], msg.as_string())
    
    server.quit()
    
    print(f"successfully sent email to: {msg['To']}")