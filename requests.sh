curl -X POST -H "Content-Type: application/json" -d '{"class": {"name": "TE Shift 1"}}' http://dbms-mini-project.duckdns.org:3000/class
curl -X POST -H "Content-Type: application/json" -d '{"class": {"name": "TE Shift 2"}}' http://dbms-mini-project.duckdns.org:3000/class
curl -X POST -H "Content-Type: application/json" -d '{"teacher": {"name": "Sonali Nalamwar","username": "SN","password": "1234"}}' http://dbms-mini-project.duckdns.org:3000/teacher
curl -X POST -H "Content-Type: application/json" -d '{"subject": {"name": "DBMS","teacher": 1,"class": 1}}' http://dbms-mini-project.duckdns.org:3000/subject
curl -X POST -H "Content-Type: application/json" -d '{"subject": {"name": "DBMS","teacher": 1,"class": 1}}' http://dbms-mini-project.duckdns.org:3000/subject
curl -X POST -H "Content-Type: application/json" -d '{"subject": {"name": "DBMS","teacher": 1,"class": 1}}' http://dbms-mini-project.duckdns.org:3000/subject
curl -X POST -H "Content-Type: application/json" -d '{"student": {"name": "Yash Eksambekar","roll": "19CO020","class": 1,"password": "1234"}}' http://dbms-mini-project.duckdns.org:3000/student
curl -X POST -H "Content-Type: application/json" -d '{"student": {"name": "Shree Chatane","roll": "19CO011","class": 1,"password": "1234"}}' http://dbms-mini-project.duckdns.org:3000/student
curl -X POST -H "Content-Type: application/json" -d '{"student": {"name": "Shrikant Dandge","roll": "19CO013","class": 1,"password": "1234"}}' http://dbms-mini-project.duckdns.org:3000/student
curl -X POST -H "Content-Type: application/json" -d '{"student": {"name": "Gaurav Gadkari","roll": "19CO022","class": 1,"password": "1234"}}' http://dbms-mini-project.duckdns.org:3000/student
curl -X POST -H "Content-Type: application/json" -d '{"student": {"name": "Indrajeet Ghadge","roll": "19CO025","class": 1,"password": "1234"}}' http://dbms-mini-project.duckdns.org:3000/student