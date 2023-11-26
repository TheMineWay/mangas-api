# Certificates folder

If you are using HTTPS, you have to put in here the _key.pem_ and the _cert.pem_ files.

You can do so by running:

```shell
openssl req -newkey rsa:2048 -nodes -keyout key.pem -out csr.pem
```

and then:

```shell
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```
