// This file contains all the endpoints of the API
let domain = "http://192.168.199.126"
// Register API
export const register_url = `${domain}/task/apis/selfregister.php`;
export const login_url = `${domain}/task/apis/login.php`;
export const password_url = `${domain}/task/apis/forgotpassword.php`;
// export const bet_now_url = "http://192.168.199.126/task/apis/sender.php"
// export const bet_now_url = "http://192.168.199.126/task/nav.php"
export const bet_now_url = `${domain}/task/apis/betnow.php`;
export const lottery_games_url = `${domain}/task/apis/lotterygames.php`
export const cart_bet_now_url = `${domain}/task/apis/betnow.php`//put cart bet endpoint here
export const track_url = `${domain}/task/apis/tracknow.php`;
export const draw_num_url = `${domain}/task/apis/draw_number.php`
export const sub_games_url = `${domain}/task/apis/subgames.php`
export const balance_url = `${domain}/task/apis/balance.php`
export const user_url = `${domain}/task/apis/user.php`