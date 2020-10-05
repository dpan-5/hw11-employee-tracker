USE employee_DB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

INSERT INTO department(name)
VALUES ("Engineering"), ("Finance"), ("HR"), ("Marketing");

SELECT * FROM department;