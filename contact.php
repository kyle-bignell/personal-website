<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">

    <link rel="shortcut icon" type="image/png" href="assets/images/kyle-bignell.png"/>

    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/navigation.css">
    <link rel="stylesheet" href="css/page_contact.css">

    <title>Kyle Bignell - Software Engineer | Contact</title>
</head>

<body>
    <?php include "php/header.php" ?>

    <?php include "php/navigation.php" ?>

    <div id="content">
        <div id="contact">
            <form action="contact.php" onsubmit="return validate()" method="post">
                <input type="text" id="name" name="name" placeholder="Name">
                <input type="text" id="email" name="email" placeholder="Email">
                <textarea id="message" name="message" placeholder="Message" style="height:200px"></textarea>

                <input type="submit" value="Send">
            </form>
        </div>
    </div>

    <?php include "php/footer.php" ?>
</body>

</html>
