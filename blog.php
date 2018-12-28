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
    <link rel="stylesheet" href="css/page_blog.css">
    <link rel="stylesheet" href="css/footer.css">

    <script src="js/navigation.js"></script>

    <title>Kyle Bignell - Technical Lead | Blog</title>

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
            Blog
        </div>
    </div>

    <div id="content">
      <?php
        error_reporting(E_ALL);
        ini_set('display_errors', 1);

        $raw_post_data = file_get_contents("https://www.googleapis.com/blogger/v3/blogs/1880289189552734525/posts?key=AIzaSyAWlZDu_kJvz02Qjls-zQXfc73JrkYRgSQ");
        $json_post_data = json_decode($raw_post_data);
        
        foreach ($json_post_data->items as &$post)
        {
            echo("<br/><br/>");
            echo($post->published);
            echo("<br/><br/>");
            echo($post->updated);
            echo("<br/><br/>");
            echo($post->url);
            echo("<br/><br/>");
            echo($post->title);
            echo("<br/><br/>");
            echo($post->content);
            echo("<br/><br/>");
            echo($post->author->displayName);
            echo("<br/><br/>");
            echo($post->author->url);
            echo("<br/><br/>");
            echo($post->author->image->url);
            echo("<br/><br/><br/><br/>");
        }
      ?>
    </div>

    <?php include "php/footer.php" ?>
</body>

</html>
