<!-- admin-login.php ফাইল তৈরি করুন -->
<?php
session_start();
$host = "localhost";
$dbuser = "your_username";
$dbpass = "your_password";
$dbname = "cloud_compute_db";

$conn = new mysqli($host, $dbuser, $dbpass, $dbname);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    $sql = "SELECT * FROM admins WHERE username='$username' AND password='".md5($password)."'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $_SESSION['admin'] = $username;
        echo "success";
    } else {
        echo "error";
    }
}
?>