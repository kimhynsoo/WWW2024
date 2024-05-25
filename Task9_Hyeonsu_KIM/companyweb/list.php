<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
    <title>Document</title>
</head>
<body>
    <div class="wrapper">
        <div class="row">
            <div class="col-md-12">
                <h2>Employees</h2>
                <a href="create.php" class ="btn btn-success">Add new</a>
            </div>
            
            <?php
            require_once "config.php";
            $query = "select * from employees";

            if($employees = mysqli_query($conn, $query)){
                if(mysqli_num_rows($employees) > 0){
            ?>
            <div>
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Operations</th>
                                </tr>       
                            </thead>
                            <tbody>
                                <?php
                                while ($employee=mysqli_fetch_array($employees)){
                                    $id=$employee["id"];

                                    echo "<tr>";
                                    echo "<td align= 'center'> $id</td>";
                                    echo "<td>" . $employee["name"]. "</td>";
                                    echo "<td>" . $employee["email"]. "</td>";
                                    echo "<td>
                                        <a href='view.php?id=$id' title='View' data-toggle='tooltip'><i class='fa fa-eye'></i></a>
                                        <a href='edit.php?id=$id' title='Edit' data-toggle='tooltip'><i class='fa fa-edit'></i></a>
                                        <a href='delete.php?id=$id' title='Delete' data-toggle='tooltip'><i class='fa fa-trash'></i></a>
                                    </td>";
                                    echo "</tr>";
                                }
                                ?>
                            </tbody>
                        </table>
            </div>
            <?php 
                }
                else {
                    echo "<p><em> No records found .</em></p>";
                }
            }
            else {
                echo "<label>ERROR: Could not execute $query" . mysqli_error($conn) . "</label>";
            }
            
            mysqli_close($conn);

            ?>

        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
</body>
</html>