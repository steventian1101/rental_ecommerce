const back = () => {
    if (window.history.length > 2) {
        window.history.go(-1);
    }
    else {
        location.href = '/';
    }
}
export default back