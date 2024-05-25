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
                    <h1>Edit Employee</h1>
                </div>

                <form action="edit.php" method="post">
                    <input type="hidden" name="id" value="" />
                    <div class="form-group mb-3">
                        <label>Name</label>
                        <input type="text" name="name" value="" class="form-control"/>
                    </div>

                    <div class="form-group mb-3">
                        <label>Email</label>
                        <input type="email" name="email" value="" class="form-control"/>
                    </div>

                    <div class="form-group mb-3">
                        <input type="submit" class="btn btn-success" value="Submit">
                        <a href="list.php" class="btn btn-primary">Back</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>