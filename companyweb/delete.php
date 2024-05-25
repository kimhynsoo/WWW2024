<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <title>View</title>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div>
                    <h1>Delete Employee</h1>
                </div>

                <div class="mb-3">
                    <label><strong>Name</strong></label>
                    <label></label>
                </div>

                <div class="mb-3">
                    <label><strong>Email</strong></label>
                    <label></label>
                </div>

                <form action="delete.php" method="post">
                    <input type="hidden" name="id" value=""/>

                    <div class="alert alert-danger fade show">
                        <p>Are you sure you want to delete this record?</p>
                        <p>
                            <input type="submit" value="Yes" class="btn btn-danger">
                            <a href="list.php" class="btn btn-primary">No</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>