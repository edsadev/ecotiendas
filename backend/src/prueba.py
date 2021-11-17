# import necessary packages
 
import email.message
import smtplib, ssl
 
# create message object instance

def enviar_email(correo, ecopuntos, total_ecopuntos):
    
    email_content = f"""
    <html>

    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <body style="margin: 0 !important; padding: 0 !important; background-color: #eeeeee;" bgcolor="#eeeeee">
       Se te han acreditado {ecopuntos} ecopuntos, por el momento posees un total de {total_ecopuntos} ecopuntos
    </body>

    </html>
    
    """
    
    # setup the parameters of the message
    msg = email.message.Message()
    password = "N0vaR3d.2020"
    msg['From'] = "info.ecotiendas@gmail.com"
    msg['To'] = correo
    msg['Subject'] = "¡Gracias por reciclar!"
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(email_content)
    # add in the message body

    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(msg['From'], password)
        server.sendmail(msg['From'], msg['To'], msg.as_string())
        server.quit()
    
    print(f"successfully sent email to: {msg['To']}")