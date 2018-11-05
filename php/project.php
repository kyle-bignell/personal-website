<?php
    $project_raw_data = file_get_contents('../data/' . $data . ".json");
    $project_data = json_decode($project_raw_data, TRUE);
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" CONTENT="<?=$project_data["description"]?>">

    <link rel="canonical" href="<?=$project_data["canonical"]?>"/>

    <link rel="shortcut icon" type="image/png" href="../assets/icons/favicon.png"/>

    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/navigation.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/page_project.css">

    <script src="../js/navigation.js"></script>

    <title><?=$project_data["title"]?></title>

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
    <?php include "../php/navigation.php" ?>

    <div id="header">
        <div id="title">
            <?=$project_data["content"]["title"]?>
        </div>
    </div>

    <div id="project-image">
        <img alt="<?=$project_data["content"]["image_alt"]?> " src="<?=$project_data["content"]["image_src"]?>"/>
    </div>

    <?php
        if (!empty($project_data["content"]["link"]))
        {
            ?>
            <div id="project-link-wrapper">
                <a id="project-link" href="<?=$project_data["content"]["link"]?>" target="_blank">
                    <div id="project-link-copy">
                            Visit project
                    </div>
                </a>
            </div>
            <?php
        }
    ?>

    <div id="project-technologies">
        <?php
            foreach ($project_data["content"]["technologies"] as &$value)
            {
                echo "<div class=\"project-technology\">" . $value . "</div>";
            }
        ?>
    </div>

    <div id="project-description">
        <?=$project_data["content"]["description"]?>
    </div>

    <?php include "../php/footer.php" ?>
</body>

</html>
