# RegistApp

A simple hybrid PWA using Ionic Framework for organizing and controlling attendance to small work emplacements

# Requirements

You workstation needs to have **nodejs and npm** installed. Then install ionic and cordova frameworks by using the following command
```
npm install -g @ionic/cli native-run cordova-res
```
# Installation

Just clone the PWA by using the following command
```
git clone https://github.com/i22zaorr/RegistApp.git
```
Then cd into the folder by using
```
cd RegistApp
```
Install dependencies by using the following command
```
npm install
```
Run the ionic PWA by utilizing the following command
```
ionic serve
```
Then visit URL http://localhost:8100 to use the PWA RegistApp.

# Server side

Modify the server URL which can be found in:

src\app\services\users.service.ts
```
private url = '**YOUR_SERVER_NAME**/api/login.php';
```
src\app\services\slots.service.ts
```
private url = '**YOUR_SERVER_NAME**/api/app.php';
```
# Database side

Import the **RegistAppDB.sql** script file into a MariaDB server or similar
```
You can find the script file into the /DB Script directory
```
# Do you want to try the app?

Go to **https://razor-test.000webhostapp.com**

![imagen](https://user-images.githubusercontent.com/81752572/119407253-44563d80-bce4-11eb-848e-9a157e83cd82.png)
![imagen](https://user-images.githubusercontent.com/81752572/119407174-2688d880-bce4-11eb-9d66-fb799a4d2c3b.png)
![imagen](https://user-images.githubusercontent.com/81752572/119407221-3b656c00-bce4-11eb-8f3c-a896fdbc1ef2.png)
