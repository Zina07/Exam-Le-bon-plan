function calculateAge(date_of_birth) {
    const date1 = date_of_birth;
    const date2 = new Date();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // on retourne un age en année
    return Math.floor(diffDays / 365);
}

module.exports = {
    calculateAge
}