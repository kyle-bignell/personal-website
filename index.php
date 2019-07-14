<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" CONTENT="Kyle Bignell technical lead portfolio">

    <link rel="canonical" href="http://www.kyle-bignell.co.uk/"/>

    <link rel="shortcut icon" type="image/png" href="assets/icons/favicon.png"/>

    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/navigation.css">
    <link rel="stylesheet" href="css/page_index.css">
    <link rel="stylesheet" href="css/footer.css">

    <script async src="js/navigation.js"></script>
    <script async src="js/explore/scenes/launch.js"></script>
    <script async src="js/explore/scenes/overview.js"></script>
    <script async src="js/explore/scenes/orbit.js"></script>
    <script async src="js/explore/index.js"></script>

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
                <img id="title-image-data" src="assets/images/kyle-bignell.png" alt="Picture of Kyle Bignell"/>
            </div>
            <div id="title-text">
                <div id="title-text-name">
                    Kyle Bignell
                </div>
                <div id="title-text-role">
                    Technical Lead
                </div>
            </div>
        </div>
    </div>

    <div id="content">
        <div id="about">
            <div class="content-title">
                About
            </div>
            <p>
                I'm a software developer specialising in web technologies. As a technical lead I bring order and clear direction to complex software development projects so that my team and I can focus on what we do best, delivering valuable software to the business.
            </p>
            <p>
                Find out more about my current and previous roles over on my <a href="experience.php">experience page</a>.
            </p>
            <p>
                Check out the projects I'm tinkering with on my <a href="projects.php">projects page</a>.
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

    <div id="explore-toggle">
        Explore
    </div>

    <div id="explore">

    </div>

    <?php include "php/footer.php" ?>
</body>

</html>
