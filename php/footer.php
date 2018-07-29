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
<div id="footer">
    <div id="footer-left">
        © 2018 Kyle Bignell
    </div>
    <div id="footer-right">
        <a class="footer-right-link" href="https://www.linkedin.com/in/kyle-bignell-52592785/" target="_blank">
            <img class="footer-right-image" src="<?= $relativePath ?>assets/icons/linkedin.png" alt="LinkedIn Icon"/>
        </a>
        <a class="footer-right-link" href="https://bitbucket.org/kyle_bignell/" target="_blank">
            <img class="footer-right-image" src="<?= $relativePath ?>assets/icons/bitbucket.png" alt="BitBucket Icon"/>
        </a>
        <a class="footer-right-link" href="mailto:kyle.bignell@gmail.com" target="_blank">
            <img class="footer-right-image" src="<?= $relativePath ?>assets/icons/email.png" alt="BitBucket Icon"/>
        </a>
    </div>
</div>
