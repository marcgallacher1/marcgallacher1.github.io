<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cara's Art Shop</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div>
    <h1>Place Your Order</h1>

<?php
    $host = "devweb2023.cis.strath.ac.uk";
    $user = "rnb21132";
    $password = "aequoJai1rei";
    $dbname = $user;
    $conn = new mysqli($host, $user, $password, $dbname);

    if ($conn->connect_error) {
        echo "<p>Sorry, we're having some connection issues.</p>";
    }

    $basketItems = isset($_GET['basket']) ? explode(',', $_GET['basket']) : [];
    $basketItems = array_filter(array_unique($basketItems));
    $orderPlaced = false;

    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["place_order"])) {
        foreach ($basketItems as $art_id) {
            $art_id = intval($art_id);
            $name = $_POST['name'];
            $phone = $_POST['phone'];
            $email = $_POST['email'];
            $address = $_POST['address'];

            $query = $conn->prepare("INSERT INTO orders (art_id, name, phone, email, address) VALUES (?, ?, ?, ?, ?)");
            $query->bind_param("issss", $art_id, $name, $phone, $email, $address);
            $query->execute();

            if ($query->affected_rows <= 0) {
                echo "<p>Error: " . $query->error . "</p>";
            }
        }
        $query->close();
        $orderPlaced = true;
    }

    if ($orderPlaced) {
        echo "<p>Order Placed Successfully!</p>";
        echo "<button class='back_button' onclick='window.location.href=\"https://devweb2023.cis.strath.ac.uk/~rnb21132/index.php\"'>Back to Front Page</button>";
    } else {
        $totalCost = 0;
        foreach ($basketItems as $itemId) {
            $itemId = intval($itemId);
            $query = $conn->prepare("SELECT * FROM art WHERE id = ?");
            $query->bind_param("i", $itemId);
            $query->execute();
            $result = $query->get_result();

            if ($art = $result->fetch_assoc()) {
                echo '<img src="data:image/png;base64,' . base64_encode($art['image']) . '" style="width: 150px; height: 150px;">';
                echo "<h3>" . $art['name'] . "</h3>";
                echo "<p>Price: £" . $art['price'] . "</p>";
                echo "<p>Description: " . $art['description'] . "</p>";
                echo "<p>Date: " . date('d/m/Y', strtotime($art['date'])) . "</p>";
                echo "<p>Size: " . $art['width'] . " mm by " . $art['height'] . " mm</p>";
                $totalCost += $art['price'];
            } else {
                echo "<p>Item with ID $itemId not found.</p>";
            }
        }
        echo "<h3>Total Cost: £" . number_format($totalCost, 2) . "</h3>";

        echo "<form action='orders.php?basket=" . implode(",", $basketItems) . "' method='post'>";
        echo "<input type='text' name='name' placeholder='Your Name' required><br><br>";
        echo "<input type='text' name='phone' placeholder='Your Phone Number' required><br><br>";
        echo "<input type='email' name='email' placeholder='Your Email' required><br><br>";
        echo "<textarea name='address' placeholder='Your Address' required></textarea><br><br>";
        echo "<input type='submit' name='place_order' value='Place Order'>";
        echo "</form>";
    }
?>
</div>
</body>
</html>
