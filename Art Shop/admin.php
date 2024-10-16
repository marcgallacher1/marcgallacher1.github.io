<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Panel - Cara's Art Shop</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<?php

    $pass = false;
    $host = "devweb2023.cis.strath.ac.uk";
    $user = "rnb21132";
    $password = "aequoJai1rei";
    $dbname = $user;
    $conn = new mysqli($host, $user, $password, $dbname);

    if ($conn -> connect_error) {

        echo "<p>Sorry, we're having some connection issues.</p>";

    }

    if (isset($_POST['password']) && $_POST['password'] === 'WeKnowTheGame23') {

        $pass = true;

    }

    if (!$pass && !isset($_POST['delete_order']) && !isset($_POST['addPainting'])) {

        echo "<form action='admin.php' method='post'>";
        echo "<h3>Please enter your admin password: </h3><br><br>";
        echo "<input type='password' name='password' placeholder='Password' required>";
        echo "<input type='submit' value='Login'>";
        echo "</form>";

    } else {

        if (isset($_POST['delete_order']) && isset($_POST['id'])) {

            $order_id = $_POST['id'];
            $query = $conn -> prepare("DELETE FROM orders WHERE id = ?");
            $query -> bind_param("i", $order_id);
            $query -> execute();

            if ($query -> affected_rows > 0) {

                echo "<p>Order deleted.</p>";

            } else {

                echo "<p>Error deleting painting: " . $query -> error . "</p>";

            }

            $query -> close();

        }

        if (isset($_POST['addPainting'])) {

            $name = $_POST['name'];
            $price = $_POST['price'];
            $description = $_POST['description'];
            $date = $_POST['date'];
            $width = $_POST['width'];
            $height = $_POST['height'];

            if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
            $imageContents = file_get_contents($_FILES['image']['tmp_name']);

            $query = $conn -> prepare("INSERT INTO art (name, price, description, date, width, height, image) VALUES (?, ?, ?, ?, ?, ?, ?)");

            $null = NULL;
            $query -> bind_param("sdssiib", $name, $price, $description, $date, $width, $height, $null);
            $query -> send_long_data(6, $imageContents);
            $query -> execute();

            if ($query -> affected_rows > 0) {
                echo "<p>New painting added successfully. </p>";
            } else {
                echo "<p>Error adding painting: " . $query -> error . "</p>";
            }

            $query -> close();
            }

            else {
                echo "<p>Error in image upload. Error Code: " . $_FILES['image']['error'] . "</p>";
            }
        }


            echo "<h2>Add New Painting</h2>";
            echo "<form action='admin.php' method='post' enctype = 'multipart/form-data'>";
            echo "<input type='text' name='name' placeholder='Painting Name' required><br><br>";
            echo "<input type= 'number' name='price' placeholder='Painting Price' step = '0.01' required><br><br>";
            echo "<input type='text' name='description' placeholder='Enter a short description of the painting' required><br><br>";
            echo "<input type='date' name='date' placeholder='Date of Completion' required><br><br>";
            echo "<input type='number' name='width' placeholder='Painting Width' required>" . "<input type = 'number' name = 'height' placeholder = 'Painting height' required>" . "<br><br>";
            echo "<input type = 'file' name = 'image' required>";
            echo "<input type = 'submit' name = 'addPainting' value ='Add Painting'>";
            echo "</form>";

            echo "<h2>Pending Orders</h2>";

            $sql = "SELECT orders.id, orders.art_id, orders.name, orders.phone, orders.email, orders.address, art.name AS art_name FROM orders JOIN art ON orders.art_id = art.id";
            $result = $conn -> query($sql);

            if ($result && $result -> num_rows > 0) {
                while ($row = $result -> fetch_assoc()) {
                    echo "<div>";
                    echo "Order ID: " . $row['id'] . "<br>";
                    echo "Customer Name: " . $row['name'] . "<br>";
                    echo "Art ID: " . $row['art_id'] . "<br>";
                    echo "Art Name: " . $row['art_name'] . "<br>";
                    echo "Phone Number: " . $row['phone'] . "<br>";
                    echo "Email: " . $row['email'] . "<br>";
                    echo "Address: " . $row['address'] . "<br>";

                    echo "<form action = 'admin.php' method = 'post'>";
                    echo "<input type='hidden' name='id' value='" . $row['id'] . "'>";
                    echo "<input type = 'submit' name = 'delete_order' value = 'Remove Order'> ";
                    echo "</form>";
                    echo "<br><br>";
                    echo "</div>";
                }
            } else {

                echo "No Pending Orders";

            }
        }

    $conn -> close();
?>
</body>
</html>


