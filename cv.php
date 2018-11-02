<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" CONTENT="Kyle Bignell technical lead CV">

    <link rel="canonical" href="http://www.kyle-bignell.co.uk/cv.php"/>

    <link rel="shortcut icon" type="image/png" href="assets/icons/favicon.png"/>

    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/navigation.css">
    <link rel="stylesheet" href="css/page_cv.css">
    <link rel="stylesheet" href="css/footer.css">

    <script src="js/pdfobject.min.js"></script>

    <script src="js/navigation.js"></script>

    <title>Kyle Bignell - Technical Lead | CV</title>

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
            CV
        </div>
    </div>

    <div id="content">

    </div>

    <?php include "php/footer.php" ?>

    <script>PDFObject.embed("assets/documents/Kyle Bignell - CV.pdf", "#content");</script>
</body>

</html>
