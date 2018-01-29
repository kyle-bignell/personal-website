<?php
    if (isset($_POST['email']))
    {
        // Expected data validation
        if (!isset($_POST["name"]) ||
            !isset($_POST["email"]) ||
            !isset($_POST["message"]))
        {
            echo '
                <div id="contact-response">
                    Sorry, it appears there was data missing from your submission.
                    <br/><br/>
                    <a href="contact.php">Please try again</a>
                </div>';
        }
        else
        {
            $error_message = "";

            $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
            $string_exp = "/^[A-Za-z .'-]+$/";

            $email = $_POST["email"];
            $name = $_POST["name"];
            $message = $_POST["message"];

            if (!preg_match($email_exp, $email))
            {
                $error_message .= "The email address you entered was invalid.<br />";
            }

            if (!preg_match($string_exp, $name))
            {
                $error_message .= "The name you have entered was invalid.<br />";
            }

            if (strlen($message) < 2)
            {
                $error_message .= "Your message did not meet the minimum lenth requirements.<br />";
            }

            if (strlen($error_message) > 0)
            {
                echo '
                    <div id="contact-response">
                        Sorry, there were error(s) with your submission.
                        <br/><br/>
                        <?php echo($error_message); ?><br/>
                        <a href="contact.php">Please try again</a>
                    </div>';
            }
            else
            {
                function clean_string($string)
                {
                    $bad = array("content-type", "bcc:", "to:", "cc:", "href");
                    return str_replace($bad, "", $string);
                }

                $email_message = "Form details below.\n\n";
                $email_message .= "Email: " . clean_string($email) . "\n";
                $email_message .= "Name: " . clean_string($name) . "\n";
                $email_message .= "Message: " . clean_string($message) . "\n";

                // Email headers
                $headers = "From: " . clean_string($email) . "\r\n".
                           "Reply-To: " . clean_string($email) . "\r\n" .
                           "X-Mailer: PHP/" . phpversion();

                $email_to = "kyle.bignell@gmail.com";
                mail($email_to, "Portfolio contact message", $email_message, $headers);

                echo '
                    <div id="contact-response">
                        <div id="contact-response-header">
                            Message Sent
                        </div>
                        Thanks for getting in contact!
                        <br/><br/>
                        I will be in touch shortly.
                    </div>';
            }
        }
    }
    else
    {
        echo '
            <div id="contact">
                <form action="contact.php" onsubmit="return validate()" method="post">
                    <input type="text" id="name" name="name" placeholder="Name">
                    <input type="text" id="email" name="email" placeholder="Email">
                    <textarea id="message" name="message" placeholder="Message" style="height:200px"></textarea>

                    <input type="submit" value="Send">
                </form>
            </div>';
    }
?>
