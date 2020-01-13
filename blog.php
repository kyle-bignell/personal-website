<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" CONTENT="Kyle Bignell technical lead portfolio">

    <title>Kyle Bignell - Technical Lead | Blog</title>

    <link rel="canonical" href="http://www.kyle-bignell.co.uk/"/>

    <link rel="shortcut icon" type="image/png" href="assets/icons/favicon.png"/>

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" >
    <link rel="stylesheet" href="css/materialize.css">
    <link rel="stylesheet" href="css/base.css">

    <script async src="js/materialize.js"></script>
    <script async src="js/base.js"></script>

    <link rel="stylesheet" href="css/page_blog.css">

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

    <div id="header" class="container">
      <h1 class="center-align">Blog</h1>
    </div>

    <div id="content">
      <?php
        error_reporting(E_ALL);
        ini_set('display_errors', 1);

        $raw_post_data = file_get_contents("https://www.googleapis.com/blogger/v3/blogs/1880289189552734525/posts?key=AIzaSyAWlZDu_kJvz02Qjls-zQXfc73JrkYRgSQ");
        $json_post_data = json_decode($raw_post_data);

        foreach ($json_post_data->items as &$post)
        {
      ?>
        <div class="post">
          <div class="post-title">
            <?=$post->title?>
          </div>
          <div class="post-metadata">
            <div class="post-date">
              <?php
                $published = date("j M Y", strtotime($post->published));
              ?>
              <?=$published?>
            </div>
            <div class="post-link">
              <a href="<?=$post->url?>" target="_blank">Read on Blogger</a>
            </div>
          </div>
          <div class="post-content">
            <?=$post->content?>
          </div>
        </div>
      <?php
        }
      ?>
    </div>

    <?php include "php/footer.php" ?>
</body>

</html>
