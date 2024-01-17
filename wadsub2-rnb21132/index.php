<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cara's Art Shop</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div>

    <h1>Cara's Art Shop</h1>

<?php

    echo "<div class ='basket-icon'>";
    $currentBasket = isset($_GET['basket']) ? $_GET['basket'] : '';
    echo "<a href='orders.php?basket=" . ($currentBasket) . "'><span>&#x1F9FA;</span></a>";
    echo "</div>";

    $host = "devweb2023.cis.strath.ac.uk";
    $user = "rnb21132";
    $password = "aequoJai1rei";
    $dbname = $user;
    $conn = new mysqli($host, $user, $password, $dbname);

    if ($conn -> connect_error) {

        echo "<p>Sorry, we're having some connection issues.</p>";

    }

    else {

        $perPage = 12;
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $start = ($page - 1) * $perPage;

        $totalResult = $conn -> query("SELECT COUNT(*) as total FROM art");
        $totalRow = $totalResult -> fetch_assoc();
        $totalPages = ceil($totalRow['total'] / $perPage);

        $sql = "SELECT * FROM art LIMIT $start, $perPage";
        $result = $conn->query($sql);

        if ($result) {

            while ($row = $result -> fetch_assoc()) {
                echo "<div class='art_css'>";
                echo "<div class='art_details'>";
                echo "<h2>" . $row["name"] . "</h2>";
                echo "<p>Price: £" . $row["price"] . "</p>";
                echo "<p>Description: " . $row["description"] . "</p>";
                echo "<p>Date: " . date('d/m/Y', strtotime($row["date"])) . "</p>";
                echo "<p>Size: " . $row["width"] . "mm by " . $row["height"] . "mm</p>";
                echo "<form action='orders.php' method='post'>";
                echo "<input type='hidden' name='art_id' value='" . $row["id"] . "'>";
                $basket = isset($_GET['basket']) ? $_GET['basket'] . ',' . $row['id'] : $row['id'];
                echo "<a href='index.php?basket=$basket'>Add to Basket</a>";
                echo "</form>";
                echo "</div>";
                echo '<img src="data:image/png;base64,' . base64_encode($row['image']) . '"style="width: 300px; height: 300px;">';
                echo "</div>";
            }
        } else {

            echo "<p>Sorry, we're having some trouble finding the art.</p>";

        }

        if ($page > 1) {

            echo "<a href='?page=" . ($page - 1) . "'>Previous</a> ";

        }

        if ($page < $totalPages) {

            echo "<a href='?page=" . ($page + 1) . "'>Next</a>";

        }
    }

    $conn -> close();
?>

</div>
</body>
</html>