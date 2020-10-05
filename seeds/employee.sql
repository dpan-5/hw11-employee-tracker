DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;

DROP TABLE employee;

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT default NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("David", "Pan", 1, null), 
("Ankur", "Vyas", 2, null), 
("Leif", "Hetland", 1, null),
("Todd", "Gurley", 3, null),
("Jalen", "Ramsey", 4, null);

UPDATE employee
SET manager_id = 3
WHERE id = 1;

SELECT * FROM employee;