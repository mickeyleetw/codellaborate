chklogin();
//--------------------------------------------------------------------------
async function chklogin(){
    const token = localStorage.getItem('access_token');
    if (token) {
        const resFromProfile = await fetch('/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const jsonFromProfile = await checkStatus(resFromProfile);
        // const user = jsonFromProfile.data;
        // userProfile(user);
        let signin=document.getElementById('signin');
        signin.setAttribute("style","display:none");
        let signout=document.getElementById('signout');
        signout.setAttribute("style","display:true");
    }
}