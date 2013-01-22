define(['./compoundInterest'], function (compoundInterest) {

    /**
     * Calculate future value of an investment.
     * http://en.wikipedia.org/wiki/Annuity_%28finance_theory%29
     * @version 0.2.1 (2013/01/22)
     */
    function futureValue(rate, nPeriods, payment, presentValue, isDue){
        presentValue = presentValue || 0;
        if (rate === 0) {
            //isDue makes no difference since rate is zero..
            return payment * nPeriods + presentValue;
        } else {
            var s = payment * ((Math.pow(1 + rate, nPeriods) - 1) / rate);
            if (isDue) {
                s *= (1 + rate);
            }
            if (presentValue) {
                s += presentValue * Math.pow(1 + rate, nPeriods);
            }
            return s;
        }
    }

    return futureValue;

});
