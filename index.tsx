import GameHeader from "@/components/uiComponents/GameHeader"
import AuthLayout from "@/components/uiComponents/layout/AuthLayout"
import AuthBox from "@/components/uiComponents/HelperComponents/AuthBox"
import logo from '../../public/Assets/loginAssets/logo_copy@2x.png'
import AuthInput from '@/components/uiComponents/HelperComponents/AuthInput'
import {HiUser} from 'react-icons/hi2'
import {RiLockPasswordFill} from 'react-icons/ri'
import {TbLayoutOff} from 'react-icons/tb'
import styles from '@/styles/Home.module.css'
import {BiCheckboxSquare,BiCheckbox} from 'react-icons/bi'
import AuthButton from "@/components/uiComponents/HelperComponents/AuthButton"
import React,{useState,useEffect} from 'react'
import Link from "next/link"
import { Login } from "@/services/auth"
import {ValidateLogin} from "@/utils/validate"
import toast, { Toaster } from 'react-hot-toast';
import dynamic from "next/dynamic"
import Image from "next/image"
import cookieimage from '../../public/Assets/cookie.png'
// import { useCookies } from 'react-cookie';
import { useRouter } from "next/router"
import ReactLoading from "react-loading";
const Popup = dynamic(()=> import('react-animated-popup'),{ssr: false})


export default function Home() {

  const navigate = useRouter()


  const [isChecked,setIsChecked] = useState(false)
  const [email,setUserEmail] = useState('')
  const [password,setUserPassword] = useState('')
  const [cookies, setCookie] = useState('')
  const [hasExpied,setHasexpired] = useState('')
  const [error,getError] = useState<any>('')
  
  // const [cookies, setCookie,removeCookie] = useCookies(['acceptCookies','user']);
  const [getdecodedData,getData] = useState<any>({})
  const [loading,setLoading] = useState(false)




  useEffect(()=>{
  // get an item from localStorage
  const myValue:any = localStorage.getItem('acceptCookies');
  setCookie(myValue)
  console.log('val',myValue); // will output 'myValue'
  },[])


    
  useEffect(()=>{
    console.log('cookies:',cookies)
  },[cookies])

  const handleClick = () => {
      //  setCookie('acceptCookies', 'accepted', { path: '/' });
       localStorage.setItem('acceptCookies','accepted')
  };


  useEffect(()=>{
   
      console.log('decoded data:',getdecodedData)
      if (getdecodedData.message === 'loginsuccess') {
          //  let expiration = getdecodedData.expiry
          //  setCookie('user',getdecodedData, { expires:  new Date(Date.now() * expiration * 1000) });
           localStorage.setItem('user',JSON.stringify(getdecodedData))
           localStorage.setItem('tokenExpireMessage','false')
           setTimeout(()=>{
            // navigate.push(`/home/${getdecodedData.token}`)
            setLoading(true)
            window.location.replace(`/home/${getdecodedData.token}`)
           },1000)
      }
    

  },[getdecodedData])

  useEffect(()=>{

    console.log('--------------------------------------',error)
    if (error.token === 'Invalid password') {
        toast.error("Invalid password"as string) 
    }
    if (error.token === 'Email or phone number not found') {
         toast.error("Email or phone number not found"as string) 
    }

  },[error])


  useEffect(()=>{
    const expireMessage:any = localStorage.getItem('tokenExpireMessage');
    console.log('expire message',expireMessage)
    setHasexpired(expireMessage)
     
  },[])



  useEffect(() => {
    const user =  localStorage.getItem('user');
    const token = localStorage.getItem('userToken');

    if (user !== null) {
      // navigate.push(`/home/${token}`)
      window.location.replace(`/home/${token}`);
    }
  }, []);


  const LoginUser =()=>{

    const values:any = {
      email, password
    }

    const errors = ValidateLogin(values)
    if (Object.keys(errors).length === 0 ){
        Login(values,getData,getError,setLoading)
    }else{
        console.log(errors);
        [errors].forEach((items,i)=>{
            // confirmPassword
            if (items.passwordRequired) {
               toast.error(items.passwordRequired as string)
            }
            if (items.passwordSpecialChar) {
                toast.error(items.passwordSpecialChar as string)
             }
             if (items.passwordNumber) {
                toast.error(items.passwordNumber as string)
             }
             if (items.email) {
                toast.error(items.email as string)
             }
             if (items.passwordCaseSensitive) {
                toast.error(items.passwordCaseSensitive as string)
             }
             if (items.username) {
                toast.error(items.username as string)
             }
             if (items.confirmPassword) {
                toast.error(items.confirmPassword as string)
             }
        })
    }

  }


  // useEffect(()=>{
  //   if (!cookies.user) {
       
  //   }else{
  //      navigate.push(`/home/${cookies.user.token}`)
  //   }
  //    console.log('user cookies:',cookies.user)
  // },[cookies.user])


  useEffect(()=>{
    if (cookies === null) {
      setTimeout(()=>{
        setIsChecked(true)
      },2000)  
    }
    // Object.keys(cookies).forEach((cookieName) => {
    //   removeCookie('acceptCookies');
    //   removeCookie('user');
    // });  
  },[cookies])





  return (
    <>
      <GameHeader description='Kindly enter your login details to play the game ' title='Login'  favicon=''/>
      {hasExpied === 'true'?(
        <div className={styles.expire}>
        <center >
          <TbLayoutOff color="white" size={20} />
          <div className={styles.cen}>Your Session Has Expired please login to continue</div>
        </center>
        </div>
      ):null}
     
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
   <Popup   visible={isChecked} onClose={() => setIsChecked(!isChecked)}>
    <div className={styles.cookie}>
      <center>
         <div className={styles.imgbox}>
           <Image src={cookieimage} className={styles.cookieimage} alt={""}/>
        </div>
      </center>
         <p style={{paddingTop:20,textAlign:'center',color:'gray',fontSize:13}} className={styles.pop} >
          Our website uses cookies to store your login information when you select 
          do not share with others. By continuing to use our website and selecting 
          'Keep me logged in,' you acknowledge and agree to our use of cookies to store your login information."
        </p>
        <div style={{width:'100%',paddingTop:30}} className={styles.actionbox}>
          <button onClick={()=>{
            setIsChecked(!isChecked)
            handleClick()
            }} className={styles.acc}>Agree</button>
        </div>
    </div>
  </Popup>
      <AuthLayout>
           <AuthBox style2={{marginTop:230}} title="Login" image={logo}>
               <div style={{marginTop:130}}>
               <div className={styles.inpboxmain}>
                 <AuthInput value={email} onChange={(e:any)=> {
                  setUserEmail(e.target.value)
                  }} icon={<HiUser style={{marginTop:2}} color="#002D6E" size={23} />} label="Username/Email" placeholder="UserName/Email" />
               </div>
               <div className={styles.inpboxmain}>
                 <AuthInput value={password} type="text" onChange={(e:any)=>setUserPassword(e.target.value)} icon={<RiLockPasswordFill style={{marginTop:3}} color="#002D6E" size={20} />} label="Password" placeholder="Password" />
               </div>
               <div className={styles.rembox}>
                 <div onClick={()=>setIsChecked(!isChecked)} className={styles.rem}>
                    {isChecked?<BiCheckboxSquare size={24} color="white"/>:<BiCheckbox size={18} color="white"/>}
                    <div className={styles.chetxt}>Keep me Logged in</div>
                 </div>
                 <div className={styles.forget}>Forget Password</div>
               </div>

               <center style={{marginTop:50}}>
                <AuthButton onClick={()=>LoginUser()} label={loading? <center> <ReactLoading type={"spin"} height={20} width={20} color="#fff" /></center>:"Login"} />
                <div className={styles.account}>Don't have an Account? <Link href={'/register'}><span className={styles.sign}>Sign Up</span> </Link></div>
               </center>
               </div>
           </AuthBox>
             {cookies  === null?(
              <div className={styles.cookieFooter}>
              <div className={styles.imgbox}>
                <Image src={cookieimage} className={styles.cookieimage} alt={""}/>
              </div>
              <div className={styles.cooktxt}>
              Our website uses cookies to store your login information when you select 'Keep me logged in.' This means that your username and password will be saved on your device, 
              allowing you to remain logged in even after you close your browser or shut down your device. While this can be convenient, it also means that anyone who has 
              access to your device can log into your account. To ensure the security of your account, we recommend that you only select 'Keep me logged in' 
              on devices that you trust and do not share with others. 
              By continuing to use our website and selecting 'Keep me logged in,' you acknowledge and agree to our use of cookies to store your login information.
              </div>
              <div className={styles.actionbox}>
                  <button onClick={handleClick} style={{marginTop:20}} className={styles.acc}>Agree</button>
              </div>
              </div>
           ):null}
      </AuthLayout>

  
    </>
  );
}


