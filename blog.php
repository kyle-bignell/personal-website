<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" CONTENT="Kyle Bignell technical lead portfolio">

    <title>Kyle Bignell - Technical Lead | Blog</title>

    <link rel="canonical" href="http://www.kyle-bignell.co.uk/"/>

    <link rel="shortcut icon" type="image/png" href="assets/icons/favicon.png"/>

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="css/materialize.css">
    <link rel="stylesheet" href="css/base.css">

    <script async src="js/materialize.js"></script>
    <script async src="js/base.js"></script>

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
      <h2 class="center-align">Blog</h2>
    </div>

    <div id="content" class="container">
      <?php
        error_reporting(E_ALL);
        ini_set('display_errors', 1);

        $raw_post_data = file_get_contents("https://www.googleapis.com/blogger/v3/blogs/1880289189552734525/posts?key=AIzaSyAWlZDu_kJvz02Qjls-zQXfc73JrkYRgSQ");
        $json_post_data = json_decode($raw_post_data);

        foreach ($json_post_data->items as &$post)
        {
      ?>
      <div id="blog" class="section">
        <div class="row">
          <div class="col s12 m6 l10 offset-l1">
            <div class="card">
              <div class="card-content">
                <div class="post-title">
                  <h3><?=$post->title?></h3>
                </div>
                <div class="post-metadata">
                  <div class="post-date grey-text">
                    <?php
                      $published = date("j M Y", strtotime($post->published));
                    ?>
                    <?=$published?>
                  </div>
                </div>
                <br/>
                <div class="post-content flow-text">
                  <?=$post->content?>
                </div>
              </div>
              <div class="card-action">
                <a href="<?=$post->url?>" target="_blank">Read on Blogger</a>
              </div>
            </div>
          </div>
        </div>
        <?php
          }
        ?>
      </div>
    </div>

    <?php include "php/footer.php" ?>
</body>

</html>
