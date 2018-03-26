<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">

    <link rel="shortcut icon" type="image/png" href="assets/icons/favicon.png"/>

    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/navigation.css">
    <link rel="stylesheet" href="css/page_cv.css">
    <link rel="stylesheet" href="css/footer.css">

    <script src="js/pdfobject.min.js"></script>

    <title>Kyle Bignell - Senior Software Engineer: Technical Lead | CV</title>
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
