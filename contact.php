<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">

    <link rel="shortcut icon" type="image/png" href="assets/images/kyle-bignell.png"/>

    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/navigation.css">

    <title>Kyle Bignell - Software Engineer | Contact</title>
</head>

<body>
    <?php include "php/header.php" ?>

    <?php include "php/navigation.php" ?>

    <div id="content">
        <div id="contact">
            <form action="contact.php" onsubmit="return validate()" method="post">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name...">

                <label for="email">Email</label>
                <input type="text" id="email" name="email" placeholder="Your email...">

                <label for="message">Message</label>
                <textarea id="message" name="message" placeholder="Message..." style="height:200px"></textarea>

                <input type="submit" value="Submit">
            </form>
        </div>
    </div>

    <?php include "php/footer.php" ?>
</body>

</html>
