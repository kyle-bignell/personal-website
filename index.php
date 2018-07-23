<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="shortcut icon" type="image/png" href="assets/icons/favicon_v2.png"/>

    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/navigation.css">
    <link rel="stylesheet" href="css/page_index.css">
    <link rel="stylesheet" href="css/footer.css">

    <script src="js/navigation.js"></script>

    <title>Kyle Bignell - Technical Lead</title>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-106748379-3"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-106748379-3');
    </script>
</head>

<body>
    <?php include "php/navigation.php" ?>

    <div id="header">
        <div id="title">
            <div id="title-image">
                <img id="title-image-data" src="assets/images/kyle-bignell-2.png" alt="Picture of Kyle Bignell"/>
            </div>
            <div id="title-text">
                <div id="title-text-name">
                    Kyle Bignell
                </div>
                <div id="title-text-role">
                    Senior Developer
                </div>
                <div id="title-text-subrole">
                    Technical Lead
                </div>
            </div>
        </div>
    </div>

    <div id="content">
        <div id="about">
            <div class="content-title">
                About me
            </div>
            <p>
                I'm a software developer currently specialising in web technologies. I bring order and clear direction to the ever changing situations that occur within every software development projects. I do this to ensure that my team and I can focus on what we do best, producing great software.
            </p>
            <p>
                Outside of work I keep fit pacticing Wing Chun Kung Fu. After studying for 2 years I now help run the class occassionally, helping other beginners on their journey into the world of martial arts.
            </p>
            <p>
                In my spare time I like to work on my side projects, check out what I am working on over on my <a href="projects.php">projects page</a>.
            </p>
        </div>

        <div id="accounts">
            <div class="content-title">
                Contact
            </div>
            <div class="accounts-row">
                <a class="accounts-link" href="https://www.linkedin.com/in/kyle-bignell/" target="_blank">
                    <img class="accounts-image" src="assets/icons/linkedin.png" alt="LinkedIn Icon"/>
                    LinkedIn
                </a>
            </div>
            <div class="accounts-row">
                <a class="accounts-link" href="https://bitbucket.org/kyle_bignell/" target="_blank">
                    <img class="accounts-image" src="assets/icons/bitbucket.png" alt="BitBucket Icon"/>
                    BitBucket
                </a>
            </div>
            <div class="accounts-row">
                <a class="accounts-link" href="mailto:kyle.bignell@gmail.com" target="_blank">
                    <img class="accounts-image" src="assets/icons/email.png" alt="BitBucket Icon"/>
                    Email
                </a>
            </div>
        </div>
    </div>

    <?php include "php/footer.php" ?>
</body>

</html>
