<?php
    $relativePath = "";
    if (strpos($_SERVER["PHP_SELF"], "/php/") !== false)
    {
        $relativePath = "../";
    }
    else if (strpos($_SERVER["PHP_SELF"], "/projects/") !== false)
    {
        $relativePath = "../";
    }
?>

<footer class="page-footer grey lighten-3">
  <div class="container">
    <div class="row">
      <div class="col s6 m6 l6">
        <h5 class="grey-text text-darken-1">Pages</h5>
        <ul>
          <li>
            <a class="grey-text text-darken-1" href="<?= $relativePath ?>index.php">
              Home
            </a>
          </li>
          <li>
            <a class="grey-text text-darken-1" href="<?= $relativePath ?>projects.php">
              Projects
            </a>
          </li>
          <li>
            <a class="grey-text text-darken-1" href="<?= $relativePath ?>blog.php">
              Blog
            </a>
          </li>
          <li>
            <a class="grey-text text-darken-1" href="<?= $relativePath ?>experience.php">
              Experience
            </a>
          </li>
        </ul>
      </div>
      <div class="col s6 m4 offset-m2 l4 offset-l2">
        <h5 class="grey-text text-darken-1">Links</h5>
        <ul>
          <li>
            <a class="grey-text text-darken-1" target="_blank" href="https://www.linkedin.com/in/kyle-bignell-52592785/">
              <img class="footer-image" src="<?= $relativePath ?>assets/icons/linkedin.png" alt="LinkedIn Icon"/>
              LinkedIn
            </a>
          </li>
          <li>
            <a class="grey-text text-darken-1" target="_blank" href="https://bitbucket.org/kyle_bignell/">
              <img class="footer-image" src="<?= $relativePath ?>assets/icons/bitbucket.png" alt="BitBucket Icon"/>
              Bitbucket
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-copyright">
    <div class="container grey-text text-darken-1">
      © <?=date("Y");?> Kyle Bignell
    </div>
  </div>
</footer>
