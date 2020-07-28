// @flow
import React, { PureComponent, useState } from 'react';
import T from 'prop-types';
import { partition } from 'lodash-es';

import ReactHtmlParser from 'react-html-parser';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';
import { addToast } from 'actions/creators';

import Link from 'components/generic/Link';
import GoTerms from 'components/GoTerms';
import Description from 'components/Description';
import Literature, {
  getLiteratureIdsFromDescription,
} from 'components/Entry/Literature';
import CrossReferences from 'components/Entry/CrossReferences';
import Integration from 'components/Entry/Integration';
import ContributingSignatures from 'components/Entry/ContributingSignatures';
import InterProHierarchy from 'components/Entry/InterProHierarchy';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Loading from 'components/SimpleCommonComponents/Loading';

import getUrlFor from 'utils/url-patterns';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import theme from 'styles/theme-interpro.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(ebiGlobalStyles, fonts, theme, ipro, local);

const wikiText =
  '{"title": "Piwi", "extract": "<p><b>Piwi</b> genes were identified as regulatory proteins responsible for stem cell and germ cell differentiation. Piwi is an abbreviation of <span><u>P</u>-element</span> <u>I</u>nduced <u>WI</u>mpy testis in <i>Drosophila</i>. Piwi proteins are highly conserved RNA-binding proteins and are present in both plants and animals. Piwi proteins belong to the Argonaute/Piwi family and have been classified as nuclear proteins. Studies on <i>Drosophila</i> have also indicated that Piwi proteins have slicer activity conferred by the presence of the Piwi domain. In addition, Piwi associates with Heterochromatin protein 1, an epigenetic modifier, and piRNA-complementary sequences. These are indications of the role Piwi plays in epigenetic regulation. Piwi proteins are also thought to control the biogenesis of piRNA as many Piwi-like proteins contain slicer activity which would allow Piwi proteins to process precursor piRNA into mature piRNA.</p>", "thumbnail": "/9j/4AAQSkZJRgABAQEASABIAAD//gBGRmlsZSBzb3VyY2U6IGh0dHA6Ly9jb21tb25zLndpa2ltZWRpYS5vcmcvd2lraS9GaWxlOlBEQl8xejI2X0VCSS5qcGf/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCADwAUADASIAAhEBAxEB/8QAHAABAAMAAwEBAAAAAAAAAAAAAAUGBwMECAIB/8QAPxAAAQMDAwMDAgMGBAQGAwAAAQIDBAAFEQYSIQcTMSJBURRhMnGBCBUWI0KRM1JigiRyobElU6LB0eFDc5L/xAAaAQEAAgMBAAAAAAAAAAAAAAAABAUBAwYC/8QAMxEAAQQBAgMFBwUBAQEBAAAAAQACAxEEITESQVEFE2Fx8CKBkaHB0fEUIzKx4QZCFST/2gAMAwEAAhEDEQA/APVNKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpTNESlKURKUr4febYZcefWhtptJWtayAlKQMkknwKIvulfLa0uIC0KCkqGQoHII+a6V4u8GzQ1SrlITHYBCQpXJUo+EpSOVKPsACTWCQNSsgEmgu/SsuHW7TLkRyTGi3iQyhW3ciMlOfPjcofHvVg6e9RbFrqO8u0qfYkMrKFxJYSh4Af1ABRBSfkE+K1smjkJaw2Qt8mLNE0Oe0gFXGlKZrao6UpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKVwzZTMKI/KkrDbDDanXFn+lKRkn+woi5qpnUPqFbtDKtybjEmy1zVL2oiJQpSEoAyohSk8ZUB+tfidYyLbbW7lq22i0219IWh9t1T4YCvwpfAQChR45G5OeCRxnAupOpP4z1S9Otra347aRGhthOVLQDncB8qUcgecYFQsvLEDPZ/krLAwDkSe3/ECyV6M0PrO26ziSZFpbmIRHWG3BJYLZCiM4B5B4I8H3FWX2rCv2WruibbtSREnC2JTbpSeCNyNp49sbMVrGoNVWbT6kt3We2y8pBWlkArcKfkJTk4881timuIPk06rRkY/DOYoQT0+FrrruF0ut4uEG1KYhRYC0svSnUdxxbhQle1CMgABKk+pWck8DjNc8i23WMgPQLu/IkJ5LMxLfad+2UIBSfgjx7g1mtm6o26R1CfbtUFa4lxdjxXHnXC2oLGQHdhTnkKSnBI/D+lbMSOPzqYba1rhVEac1DEntFhFFpogj7rp2W4IulublIQpoqKkLaX+JtaSUqSfuCCK71V7Q7zMu1SZsVwORpc2Q80pPgp7hAI+xxn9a5LjqDt3By3WqE9cp7QBeQ2oIbYBGR3HFcAkchIycc4xzWHspxaEY7jHEOanawWBp7qpq/UcyZqafGs1kCnGU20KS806j+n+XtIcQSBlTnJGcADitXVqyHCQ8nUGLQ+0Eq2POJUHEnOC2U/i8HjGRjxVVvPWLT8RMhMNEqW+yhThSpstIwBnJURx7e3vW2KOTdrffyWmd7Gnhc6vLf5KNi6re6f6PfmXdEQw0uusNwo6tqo0lJI7LaD+Jokbhj8KTnG3xmreudT671HaUpYU2/KcbaDENhbohxFuJS4+rHqG7xnI9IVyARmqXi7XjqHrAvItzD86W5mPEba3hgbQDjxnhIKlHzj2AAGl6Vh3LRMCe6bXdg6WlPv99IZ+scQklKS5ykDztGePAyaliFpBc6gd/x4qPJllgHBbjtzHnZ9dV2eqOh7TpmFOuBuzUKDMllxmKWNyg4v8SU4P4R6leOPHORVf6ZxITOvo9raMeVb5qSwpQWUKQpKS4hxtYwQsYVyDn1KqhXPUd41bdFXfUUnuLbSQ0zyG4yD7IT+nKjyeMmrD+7HLFbbFemX1NuOPiQooThScEgJSfYgHz81zTGYbHd/xkOLqAH9ka6GxtS6xr8+QjFc0FvDZJ5bgAEVqK53dFeop18tVgiIbuFxQktBDe1ay68snhPpGVKJ/L5NU2363everw5bn9llgPohyWxtWiR3yoNPJV5A3JSnHGCpQNZdpewStTauZi3ae9JmPrUuZNKkhxaUDHp4x4CUgY4HPzVo1ZLtFruepomoy4i6hovRpkLMdU5BbTht0p4Ktw+MZSSMEkVeTtjxBUp1rXwVDgF2YXcI228epW5OOJbbUtxSUISMqUo4AHyTXTtd5t11XITbZ0aUqOoJdDLgVsJGRnHyPHzXlpXUq8Wd613S9PrvcFXofgvDd3Ck7cpHgK8EceTz5zXoibDtFxvbEhq5vWu9mOhlTbElDbym+VJQ42cg7dyiOMjccHmosbmSWG+tLUvIxXY5DXq2UqusibZrtCYfuL9whTVKZH1KUBxpwJKwQUJSCkhKgQRkHHPPFiByKyRSjEUlKUrCwlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiKsa+1K7pi3RZTcdpxt17tOOvLUltobFKGdqVElRSEgY8qHNZzZ9T3fqfqmHBTFTbNOQ9smdGL252VjlKVKA/BuCfSPIzk+1SvW6b3X7da96g2hKpTqfZXO1H9sLqs6BUImvmNMy5CgxLtyLi2WkhDjEpSQrCXAM/4ScYOQfirBkDWQCU7m6+6gOye8n7jZo3Up1s1RdXdR2jRlmnC2M3EoE+bhO5LK1EEJKuAAkKJP5DjnNgT0r0JeLA2iDEQ5GeQCidFlFS1443hYJBOfsRn2qD6wdPr/AHNdsuemXDcrm04lD4lraQSkHchQO0Jwk5ynHOfBqd6K6d1Vp2He0ascgFE2YZrDUZwrLa3Ml3PpCQCrBATwPVVL3dyEPFjqugdK2OFphfRG46nr65Krad0Rcp8e8ORb0qy61gzHITs6MMLmxkqyyuUgjapS0+oOAEkeSTkDoR+keqTc3pE6+22bOc9brjzrqnFjxk+nOPYe3xWvavthVFcvFvTJTeIDC1sfS43yAAVdhSTwtKiMYPgnIIPNeN42orrP1K5qt+a6xfJDne+oZUR2/YNgf5AMJwc8Dmo2ZHHwfuC/IqV2fLMXHuXAeYHqlfNbaPuHTu72K7zZTDseQ+UrUw2shtxA3pHPJyAojj+k1rvWnV/0nTpL1ifQ8m7vJhIksLCglKkqUrB/zFKSkfGc+1ZvqTWbGrtG2+O1fZi9bqkJLNubjd1px7lA2jaEpG0kglXBznxmo91uDPuOiNMQVyHZn1jk25vP8uOudtHbUfgAKUAnwMfnVngNL3Mjj1jbzvYn8erVP2o4MD5ZyRM69K0IHP5+/wAaW+9KIjkHp9ZmH2VsuBnJQoYIySfFQtzYuMVd4Rom5vSZUuQp9bBjoW004oAKHf4CeBwCVEHjGMAWi/crtVpbWplqY6W3Cg4PaQgqKQfbO0J/ImpthlDLKG2W0NtpGEoQMAD7Ct5k9oyEb6qO2LhiEd8qXn7TegdR31ybcboo2tKgoqfuBU468ofIUcpSCPxHx7Ais11eu5NaccTLYSlJ7bhWjP4dwPIPj2r1pqmUhNtXCTlcqakssso5UvP4jj4APJ8CvP8A1VvUbTstVjYQxMvS2wZKHmA5HjNrTwFA/wCIsjwBwPOfFTRnNbC98zqHIBVpwHvnZFA2zuSVQbRK/h7S0W7xpTS7ncn3GmY7a1pdaS3wVqUnhKeQcZBVnjwcTDWu9UTNPyLRdLu9IjuH+YpeNykZztKvI5888jj5qFtsSInSTv1MlpD8BILbTpKVP849CvBVyPSfIyR4qOjF6XLSzBUBKxuGV7AkfJV7CqrKzJ2SRSx+0w7CufMbb3sf9V9h9n4z4ZoZvYlbuSdgOe+1bjpr0K7MMA36BDSgr+teaZDSQCXErUBjHz8fkK2PXdji6eXFs0SQw6gDvKQmOEqRz6Nyio85yeAnx45qY0joJqx2iZqvqJLZvF4MfKVoIKY7flIQsAFTpOP5nnJAHyaW/GvupjcjZ0mZezGU+O6vk7QEgZ8bsYAzgE+ccmtvZuDE2R2U9tBpsDp+PstPanacxjjxIn+0QATtewJ9eK7OkJljtmo7ddrvcTHRb1OqKQ2tWVFBSANoOT6ifyFdnqqqza223yw3tlcdURcRIQj1CU2StKXEKwpIKVbd3tlOeCK6qen9/Z0ihNyisW5LOXVuSJCSVEjwQjJ3E8V1bPZo1qQxFjJJkTH22lrSnct1xagnx8DPjwADUfAjmz5JZcxvDHqST8gPLT/SVL7Qmx+zGQw4LuOSqAHvsnTmSfnyCkP2drJZbzcZUq6fz7vY3EJajuK9CFqG4uhPuQrKQfA2gjnBrQrjItNksV9tc5ECTMbU5IiJdQHnJqnCpSPSDvU4FZSSOeArIzUbqGx6HVp9+PdoX7ujQni1Hm7Wg5NIT6yjg7xkkHIABHBFRHRtmzWmVbpMlkxXpaHTBdkp2pdSpSQlaSfBUlJGODwB/UCZUUJFmP8Ajy5HTp5DS+S1vl7wtD3HjFEjflvfn0HPZW61XNUVGlbhqV8x2HW5KIy3nN20rKSylxfgr7QUM/Oc81foc2LLTmJJYfA89pwKx/as31f9ZZkNWKTpGVqXSDyFqdMZpLjkfKsob2FQKgnkhSRkDbjkc51+7bZpnUFo1Poa43ddlQ4r663SlLSpoAcBIdHcCSfSrII88+1bhG2Y0N9a/v3KrknMbi523rbe/gvS2aZrF7lrHVV/cIsl60paIezduRPbkPeOQSvG3Hn8Fcmm9B6ik3u2Xm56nbnsNOF3vNSVOq/CoejI2Dk+wxjNeP01C3uA+a9HKt3CxpPyWyAg+DXG8+0ykKecQ2kkJBWoAEn25qDRF1BCWUxpsS5MHx9aktOpPtlTY2qH+0H7muCLpRqXLNw1QY93nlO1tDjI+nipPlLSDnBPus5UfsMAaOEDUlSxtZVnpVetyHLNem7Ylal22S0pyMlSiosLRjc3k+UkKBHxgjxirDWCKQikpSlYWEpSlESlKURKUpREpSlESvxRxX7UHd9SQ7bc2retmbIluNF/txYynSlsK27jgfPFZAJNBKtZL1QWpes7kCCQhllKf1QT/wC9Q3V9r90a/s1zs8tgSkQmwC0sKU08wrjekeApDgGD5CVCrhq7T8i+31q5suSrVGnONRFGbGSo79pCVJQCFAHAHqIOTwKtur+ntm1LZo8MIVb3ooUYkmKAlTJVjOU+FA7RkHzj2PNWbshjWRA8rtVYxX95MTuapSejNTwtVWZmZEW2l/YDIjbwVsL5GFDzjKTg+4FcWqpN6ZudibsLsLLshwSWJKFYcbDSjkLGSnBCfY5JFeZNY6S1npO6yJMC4FtmGG0vzoDy2EgKKi2VpB3DPj3AJxnmubTfVjVbMuA1cZgmzg4ppp5xKfwLA9BAQBkqSkbs55rR+mBfbTp4qQzK4G/uCz4Lva66vaku2q9tgmqtMO2OrZCWjvTKcSrapa9yRlGQQEkeOTyeJlu2aR1tpy46ju0m32K9qbcyxHeEdrvJBPcUFE9zcSDkAefnmqvpq33bqxqm53CNZ7XbHNockOtJIBUfftk4UsnyonH2zXa0FouPqGVJc1I4iVZos9pDiErwpxW5TaiScFKArCVjHIIweBVW/GeXHiIdxbCrA8+Y6afFdBFOOAFjeHhqzdE30Gunnr0Ct/QDS0m3WVjUcvTqpN+mErhvuuJbaYjqSACCSSCrk5CSSCB48/d80/Mm9XVW25SIjCZdodU0n1KZQt54BSU5wedh+OTnHOK3xKEoQEoSEpSMAAYAFZL13jBAtcxnc3JIU2HUcKSUrQtJB+xBNWHZ44HCJmmh+IFqj7Vl71vev5EfC6pfulbZqLT2oYqNTSnn7JCJbjSHF91KVupCU+s+sJHKcq4BIHvWtjxVR0Ve2NY6WUi4NtrkbPp5rJ8KJHkD/Kocj9R7V3GrRdkxTCXeyuEBsC+x/wASUfBc3Y3Y43bc+/nmsTEudT9CF6xgOAFrrHK1mN76o2q29VWGWXY7wLqbfNlEFTcKOkqJAIIHcW4QSeQlCU55PFh6zaWsGoLPFuc6a1AuCCGYc4JK0u7uUtqCQSpB5OR+Hk/INR6j9KFXrUU646NjxmVNJbblRlrDaXndo5b4wDt27s4BP3zmk2/SPU+DJjN2y3Tordvd77Sn3EOMxz4K0I3HccEnakEn4zVbLI4ymORhLDtXRXkUUTWtmik4XDcev9VAQuRN2Q4LX1LrzgSlgp3Zc9hj5H2rYej+h7BqOyS2ZLk2HqGO4XJEqKpKUuIXwlIQoEbU7SCCM55zzgVLVFlf0JquyztHTmnQiElxEp5rufUOKUruubSNqfUQNvlO0ZrvaIh6icuBvEOdIC1ul999xaW0qUVErBOOMkq48fY4rXHkY/ZwEchPH4f+fd6++ZcXJ7TJkYA2PY3u6tP7G2ysmtZUzTqF6RfuaplthKbkh11tLa0gpJDZxwUg+ocDkj4FWvpclqNBkmyX61yb+62mTJt5WhaQ3g7G96eQQCckbgFKPHzkmubZP1FqGdqBSJUphbhEdx1KSQ2gBI3JR6cnafArkMIadk7JKHY9xaSCW0naW9yQcZHkFKufYg4r3k/9A0VFG22g6nr61rqtWF/zLtZpHU8g0Og6HXyB00tXHqH1QjTLuxCMO4fTtoSsNISjCHCMkLO7G4cgYyP71SHtTy5AkERe0hR/lpWNxxn8KVA5SojjcOeTiuCSm3y2nH/qCh9RKlbk5Clfb49v7V3lXtEBTeyEiO80pC1tuDBChg4Oef8A6NQMvtuSciGP2Yw4bb1ehPU8/NWeF/z0OK0zyAOlc07nS61A6Dl5JqnV6rrJi2u7x5OYUduOGIwSpDCdo3YKlDc5jGTwOAPmtp0RftNa5sytPO2uQ01BjoQ21OSjctpICd6VIUcEYGecjIrIrXpwXq7w/wBzy40uS+8HNruUndypW4fHnOPmv2ZrZtpbaYcFmPESohxsL2FaDwtBWOQCMgke1bD23LLK2hUYNDTX49ea0s/5+HHicWm5qs60L8ByFih0W3aauUu2Wd5UyX9TbvpZEqE+8MOoZaUQAs/1DYUKCjg8nOfNd+db3XumghsIUp0QGyG1DJUUpCinHycEVX7rbXtRvR9QtWhmRAtRSIMB1AJmsjla0ggY5Ce2DwdmSAFAjSIzqX4zT6ErSlxAWAtJSoAjOCDyD9jV4ZWuAe3zVLIKNka+tFQr70507qWCJ1ubRDkvthxl9sBSeeQSn/4Iqnv6T1Do6danIGoGIiZUpLTimoylII4/GgqwoYz8HjzV70+/doGsLhbkQWl2Bx9Xb7TnqhK2BeVAnltwlWNv4VZGMHiS6g25M/TT5K1oMc9/cjlQAHqIz7hJJ/SpDMiRpEbnW0+9RW4UAlDuFdli5yoExmHfEsjvelmYyClpxf8AkUkk7FHyBkg+Ac8VN5qhagueomGYkQosU1+apKGIwbcWZSdyd61AkBtCUkqJ9QBwOSRmwL06hs5t9zucAAYCWn+4gf7XAoD9KiuaOehW4MDRRK49TOD95afQysGYJwWhvyS321pcP5BKjz4zj5qxDxVRvCFaWtRk2pkXC8S5DMUPz3jlanHEpBWsAlKRn8KRjjgCrBZLii62xiYhCmisELaV5bWklKkH7hQI/SsO/iK2CydtF3qUpXheUpSlESlKURKUpREpSlESou/WWLd2mu93GpTJKo8plWx1hRGCUq/7g5B8EGpSoXUr7qkxbbEeMeTcFqaDw8toCSpak/6towPuc+1em3eiyN9FDXaQ/L0GZ0stGXDcS+txHCFKYeBKh9lbCf1q1zp0S3RlSJ0lmMwny46sJT/c1B6qajQNEzYLDYbacjfQsNI85cHbQkfJyoVGO/RSepsG3S0odk220fVRg6AQCt3YpxIPhQDYGfICz8mkjgACBuT9FsDQ/wCapGuNWaakdQIFp1Euei1TmWiplCdjUg7lBtyQchSWwScJ9ztUeBVf1p0c7GoYkXScgtOCKl1pE51R+pcStW8pc8JWkds7cYIJIxg1WesiGdQ9XrpFittpcQluKtbitoPbb3KWongABR5+1UzTuqtTOwnbc3qRy22thSFpU+pT3aTngtAgq3jnhJH6CoRze8c6Ij2dtDXvVkzBazgmFcVdL9etla+n2kdVaj1Lerdary9ZUwHlRLpKYWpOFBZBbRt/Gcg+4Ax+lekZOirGdJx7HtdjQ4jKmmn23drqAR6lFfuVeVZyCeSOKq+k9MSBp8XDSep3NjqFPNJaeTKakvHlS3lqHqWtX4toTtJ+1dqDqpnXGkotu4ZulxP002K0rKmWwR3lH3CSnIGfdQHmpMcJj9pht3r3V4hRp5XTOBugPl61VNsHW6XHYiRrnY/rEM4bdnMzMrdSDjuhstgEkDONwzmrF1vubEe36auTXbltIk/UBkKx32cJ3gH4KVYz7bhVP61NfuDWCnkMNtx7i0l1tYRwVJAQtP5jCT+RFVS56lGobVamHd4Vb4ohpBOQfVkq+2QED/bUHs/Nkbl9zPzND36fVSe0+zoZMEZONpQ4iL6a/wBgqydMtRG23ATGEOpjoUWJDC1BS+yTlBOOCoDBz7kH5rQ+rPUtzR6baxZYLNznS099SVrKUNseyuBklRzgfCVH25x3T8pEPUlpafSlpuYRFWr2UFKwhX5hfH+41aOqWmjAdgTUh1/6koiBIyoh0DDaU/GRkAfP51YZ+W5+L3lfusPC73GrHnv5HwVT2biRR9oDHcf2ZBxMPmL4SfDUHxHiuTTnVy9uXViJ+5Lc19dNT3HnpKwkqcIACePH4Rk/2qf1x1nNgukaFbbEqW6GwqZ9Q+WPpnD/APj/AAncRjJI45GM+2XapiSdIX2baZimlutBCm3dhG5tSQQRn2Ctyc/Ka5hcrVqFapE2R25st3LzzuC3vWrBUfhI/wCwqof2g9pMTx7WmoHhqKv6+Wi6dnZcEobKP40Tv8D8Pf1Xfumpbnq/VEORbtOwmFu4jPRlvhxp9alZClKKU7Vc4yOTXb1PYb23Alx9P2Z1+NBeV9cLc+p5tx1RGEtoIBUpA9KsZ9s+DUwNFmKza9SW0PMQE3tDpivZT/wv1CENOpBGR6UhRB9lA8Ywde0kpDEaZb1ZTIiS3i4k+SHHFuJX9woKzn5yPY1uZgtkMnfi3aC/qOm1eqUebtDuGRnFPsjl089dd/mvNtssGs7ZHcl3e2v2mxZBdVJkISteeNiW0kqKleB4x59qjteqm3SI9fHC4l2RORHceTjaVrSpQQAfhKTj4AGfIrT+s15fvOqYWm7blwRlJK0J/rkLHA/2pP8A6zU5rmzWWw9NotgmNd59xxLjZSdqi+khSnc/A8fkQKtI+zY4cYxRtt8nXw2Pr6Lnpe15Z8xs0ziGRXdeO48elfdUiz6e0ZamYk2wG43STIbKlLuqwsR88EdoJCN/nnBx5B8VYh0stuu5bl8ukm6QQ8hLY+kcSjvlIwHMKQcccf6sZ+M5/dp6jGejQypCUDY442kkIz4bSR4UR/YfnVr0pddY3PQ0HTOnUykTm1OJnXOS7uVHbK1FttGTkHZjk42jgAnxvkjgH/4o2gltFzq0v6fTbdRmPyCf/pSvLQ6wxt26t9uY25anXalC3C32vQV0u1tsVymTpKmxGMuS6hRitkDuNp2pT/MJGCr2TwMHNTHTnpppvU6nrhqNuPIQ4kpYtyZKkKxnl1xKVAgn2HxyeTxe9B9K7dp5bcu5KFwnIO5O8fy2z8gH8R+5/tnmprqCw1drebNEQhd4ljYw8lOXISScKkBQwUFAyUnIyoAUcIGsGPE0Vvdc+q9wnIlmORM43VAXy8VI33UFv082hp1DrjiWVOhiOkEoaQOVqJISlI4GSRk8DJr70xfF36IuSq0XS2I4KBcG0IU4kjO4BKlED7KwftWV2q6OzL7ftV6ucYVZbZPetYiMkqEVEdxRafdSMlatwONw4KwoDxiHuPXSFfLqi0/w3cU2pag4txTyEuPoAJSgt/0hZAGCrnOPeoYe2wDpasxiucPZFnn4LY25sZ7WbbdveQ+v6NYl9tW4N4Wnt7scAnc5gecZ+K+Nbqv78QW3T1vjuGY0427OkyAhuKCAAdgBUskE4xwMc1zaJvdkv9gjz9M9r6BwkdttsNlpY/EhaP6VD3H/ALYqSvr0qPZLg/bmi9NajuLYbxne4EkpT+pwK994NHDko2ocBXxWeWeXcrNry5tSG2r4sW9gLVBa7S4yUFQLSELWrePUlRwoHnwTgVeXi1qSwtrtl0lxGZAStEmHtS4ADyPWlQHgggjI58GvMvTbVXfvE0yry7BLkR4vvFW11S8glsKIJQpSvJA3DBxg8j91FrjU0GzRbXYZz9mixWUHttIa3lzGVesA+kqJPJJPlROar4s9nd3Made3OvFW+R2W90lQ6gAa8vH8Ldrtbploes8Vi5TLq2/LCkxZy0qcUptCncpdwCB6PCsjOOU1P6X+kdE+XBW+lMmQVuxXkhKo7u0BaSPIJwFHkgk5HBrNulmu4l2mufxVuGpmkltp0IUtDrf9XaQkHYeBuHk4BzjgX+2tTJWrHLpHjriW5cYsuh/0rkrCgW1hHlO0bxlXJChxgA1ZMlbNGHMNit/oq6eF8LjHIKIVmpSleFGSlKURKUpREpSlESlKURKpOsZT9yfctsbTl8kSYriXWJ7DjcZDbm3hSHVKz4UUn0kckEEVdqYFemnhN0sg0bVNsFlvs6TbZ+sJbC3YDY7MSNygvbdqn3DgArwSAkDanJPJI29jVekv3veLTe7bOXbr5bCtLL4R3G3Wl43tOoyNyDj2IIPINWqleX+3ushxBsLyT1Q0XqqLrZ2836Nb2Lbdnkx3p8RSzGjqUEoDjoVlTaTgZJ4z8ZFR2ttNW3SVwgRLfdYtzZeYSp15h1Kj3c4WCkE7Rgjbn717EdaQ60tt1CVtrSUqSoZCgfII9xWO676T6RhwX5sCC7GlyZDLTEdh4pbLq3UpASn28ngcAZOOKrcrEBaS1W+F2hTgH/IKi/swQb0vW14nNSH0WJMcofb3HtLfUU7AE+NwSCc+QDz5rQuoOq9NaCuz8iNf/wB23KQ4HZcFmKJTbp/zuIGFIJz5StOfOCavj1tTp3R06JpKA0y9HjOqiMNjhTu0lOc+SVY8+fevM/Te9aR09HuWqNYu/vLVIfWiPbHklTyHB+JxYUPSsrJG5X4Qnjk4raQYmtjPx+y1NLch75eW1cz5rY9J6i0t1k06YV+hQnpDLgWYhdOVAD0vNn0rAIyD7jkHjk/GpOjmkoWn7pK0/aHI1yajOOx+1KeUC4lJKRtKiDkjH6157/fF6vk673dTagqRJbuEiUwkpXDUkqS0pDmco5XtA8qx9q3LRXVC6QdO2+568MRy2TnlssT4iSFtFB2q+obxgDIPqQTx5Apj5DXOojUa35JlYUjWkxnQ6VfUbKF6fWDT+sVi26giGQ0UCdDWh5bSkkgBaQpBBII2HHjKc1eNRX9Nou6Y89huQiE6h5SnEg5SPUHBngKA5z7EVS4LX8I6rCWv8G3yj29p/FGUSU4+3bXj/bVm64wG1MQ5oJ7EltUN1aPuCpB/tu/6V1Lo43Th7hYkHz/C4oue6Dhs3E75E/f+lzaga0b1IvMBm5JYWxFTvbektuxnXyrBDbZUE7kYwo4znKcec1bLRoLTFnmtS7baGGHmk4QQVFI/1bSdu7/VjNR/SlMa4dPILElCZQBW0/30hfcUlRGSD9gn8hgCp13StoUQW4q2FDgGO+4zj8tihVS8NY4s2r14Lo2TB7AWk0uhe0uaguxsrXogRXGn7g6ocuc70MI/PCSo+yePJ4kL9AfU41c7Ytpu4RgQQ6dqH2vKm1n2HuFc7Tz4JByVrW9uW/dLzpO9vvphr+lcEsBaZRRktpV7qQvCkoeT6gQNwUK1i/z1JjJt0RKV3Sa2pLTKlfgTg7lrI8JHz7nAHmtbQOO2cx+fqtr2vYG9PwsG6f3Nc3XcnUD7DLri3HZDaZElLCEqWeBvV5wCAAB7favzqNqR266imPrLTP06fp20dzelG3yQoDCsqJOR9qmf2epcefcrtGloYUHo6AhhSRt2JI9ISfIH/wBms71jBmtajv7EaA+ttd4Vb4qWmwAXVuKWhAHGPQOParWWYQue8DVrdPXmqSOFk7Y4R/6dqefn8Nf9UjOnN3x5hmbPftFihNBMdmKFblnIGNw8Ekla3CMnnAzjHojpx/D/APCMJvSTjTlqZ3NJW2hSd60nC1HdyVFWSSck/JrFldJtWosyH0sQHJSvMQytq0/7sbc/rWsdGbDctO6FjwL1GRFmiQ+6ppLod2hbhUPUOPBqgizcrJNZDA0Db1ZXRZGDhYsd4r+JxOt/gbKe1ddH7dBitQdonT5KIUdaxlLalZJWR7hKUqVj3IA964Zcf+HrE+5bEpdnOKbSp+USS4tSwjuOEckDdkgY44GK7V6ct6rpZIlwjKdddkKciLx6W3kNqVknPnbvx58GpOQy3IYWy8gLaWkpUk+CDwRUsOqr2UMGl44vsxtvWepWI05Ult6a533QgtJfWFEryjJG0L3Yz7DNSdg1XcNLuxGoUtLFpXLadmx2mGnC+1vT3ATtKlEoyAM+/GKv+h9HPaS6wpdguCRZbm3NbyRuICCkkKyPZRA3DzyD5559V9FYVrTcLvpOezbEtNrlCM9bm5pQpIKgGSsjtjI+FY9sVSnDlEhka6qO3oroXZ8IjEL2g2BR+XTQp06lotHWD9xwGikPWgquDLXKWHUuqU0HCOCtDS0NqV7n3Jrc6ynpvF05otH0sBy7XS+XhpFwflORlrXKBAVlLm0IKRvyQFEgr55NXprUsMvtszGZsBbqghBlx1NpUo+AF8pyfjNWkELmsVLkv7x5IG2nr1sse/aRsVptiomo48NTd5lrERLkcpQHl53fzhj1ehK8HyNoGcYFZnHu1tlW6Wi8R3xNQyBDW2vLe8KHpcT5ORkA5wPj3rc+rui2eol2s8SBqSHDn2hbinoasOqKXEp9RQFBQUAnjPBCj4rPOrnS7+EtHtXW23WTJRHUhuY29gFe5QAW2kY8Ej088c545rc3HdJIJGNGgVv2dmsjh7l7iCTsrV0xlw9U6mjyolnRFkQFF56UzwgZSpIT+as+PgGtvAxWV9ElPM22PCgLgLtbcNpyXsSpLiZqh/MA+U4AJJHk4BI4GqVLw8YY8QaDd6qu7SnM05NVWiUpSpSgJSlKIlKUoiUpSiJSlKIlKUoiUpSiJUKuzuStSJuNwW24xETiAwkHDalJwt1Xys5KR8Jz/mNTVKLINIKz3XHSTSmrZky4y7ehm8vslsTW1KGF4wlxSAQlZTx58jjPjGhUrBAIoo1xabaV5JueiOosHtaOjWJt+G5JEtdxi8MyVY2pLrijlCUDOEY85PPBq9aq0+iL0cVabcES0WdS0PTnVdtD8hZUhxLQPnC14zwMpxyQcb4RxVce0nYWbsby5G7brbqpZzIWlhLu0gvFrd29+CfXjPJOc81rjgZHZAuxXuUz9bI4ji5G/es71fpqTaNPWeU7JbkhiOzCcLbQSMJQAlWQfVzxn7iuSRLOouj13iqO+dZ0Bwc8lLeFoV//ACFJ/NJq0ahZgsWRJbfA09dB21NYP8orBUh1kHBAyASjxjkYwQcy6e3By1a4VaLw2pCZqVW6Uyv2UR6f+px+S6u4nceMGjdmo8vX0XPZURjyTKf4yaHz9fVXT9nmZ9TpKaArKUzFKT9gUgf90mrh1Gu0qyaMuU23o3zEpS0zwTtW4tLYUcewKs/pWD6IvErR3Si7x1KLdyl3N21s84UlSFqS4sf8oz+pFblH0dZ1xglpMtu3voCnIP1ThYcyPdBJH5gYB981EymBzuMnQ/YKTgSAAMcNt/iV5f6XW9+1Xh+dGty77YojaPr4zLe5wNBeUrAOQrB5KPJAPtmvWOmYVkZgNzNOxYTcaWhLqXYzYSHEnkHI/Px7V5+haZunTbWy7eiRcWNOOyQ4zLS64hpxk8hLi0kDcjJTzgkcjzVeuUZLkxd3skpTK40hUhhSVHcwQrIXgn38n5yQfeuYGd+je6N4Op1+nyXZPwD2gxr43Vppz8x8Vo3TPTFw0p1cuEK5IStt5hx6NJbb2tvIKifSP6SMgFPtx7EGufqfZJl401Nt5jT1Xxu8G5YRFcW3IbG5CNjiUlIw0pPBIOUEe+au7L14vuntNX8WsxrvGdEh6C6oNqWhSFNuJST4yFBaQrHhIOPI6+u7um52SNakvzrQm5SkRJb7jRacYaIUpQQojaVq2hsYKvx5GcV0M0n6iMWL0rTfcrmcKE40unJ19eiy+w9TdSWy2oZTNh3NLacJMpClrx/zApJ/XNav0j1VcNXaXen3dmM1JamOxsR0qSlSU4wcEnnn5qLsvTHRTrCvoVyJiUkJUTOWSgj2IBGD+lT/AEzssKxacchwO6T9W8X+66VnuhW1RGfwg7QQPYGq/Hx5ozbzp0Jv6D150LXPyMWZv7LKde9V8rKnL5aI15iIYkl1CmnEvMvMr2OMuJ8LSfnkj3BBIIIJFQFptcu5fWuTL5dVxg+4w02lxDZAQdqlKKEg5KgTxjAxUvddT2a1OKbnXBptxP40jKyj/mCQdv64qi3HqFaNO2m/TW3nVpkyFuWxDTKlrkEtI3LSnH+GHN3rOE5zyeMzuIxsJOiro2vcaaNVPQ39M6ZuTrLUiTMuqG0suBAdmvtN+UoIQFdtPvjAz55rlk9Q9NtPNR0XJtyQ5n0BJBbwcetJwU8+x5rLNO9ZdLaR0iiBEtF6XPZSFqQ8Eb5byuVuuObjyVZJJ55GB7CUtPVfp3rdtlGp4LUKekctzWe4lP5OpHjn+rH5V4xW8VPcLb4b/H/FrzncPEwGn9T9v9XebuUXp/eI8i4CVPtcllxqA5GUlSIyApKlNhBIATynG3nCcHwKs1519peVpR6X3P3nFfV9MYjaf5i1EZIKVEbcDkk4xj5xXXjaY0JqLTSrbCcjzLXGdXIHYnrJjKUCCQoKykYzgHisL1/ZNLWa1qVoq9yLxFVO7Mlta0vNsKCCvb3UgKUlWEjGVDzyMYqaXRPPE4HTp0HrdV8Uc8YDWuGvXqefj5Km3Ny4r1JOud9jzIlwmOmS25JQW3FNnhtQUOD6QnlJxxVy061qHqhqO3WK43l6Xb4+2RJS88OGEqAVgDlSlA7c+fUSTitL6fdW7LD0uxEvX1jH0iUsoV2y9lGPTkpH2I8DwK6HSDTNjvetNU3y1wnmbGSluKlRLZKnAFrSCkghIG3CfA3/AG4ov0zXzGRr7adfX+7V7l1zsiSKAskj4SBQPj4flaT1GMK2WETmCmNd2NrVr7Cf5rr39DCUj8SVHgp8AEk4AyLinOBkYOORmoe3aZtFunibGhI+sSkoS+6tTq0JPkJUskpB+2KmasnG6CoSeSUpSvKwlKUoiUpSiJSlKIlKUoiUpSiJSlKIlKUoiUrp3e5RbVCXKnO9tlJA8ElSicBKQOVKJ4AHJqKXqQxkocutsn2+KsZEhxKVoR/+zYolH5kY+TXoNcdQFkAlWE1TdZBy6TJdrceTHgRbcqa8pRwlxxRUloK/0JKFKI9ztzxkHlud7N01Fb7FZLkwkPR3pcuRGWlxxptCm0pSPISVlw4UR4QrHPIj9ZactcOD+9pMb61qMgonIlLU8X4yj6+VHO5OdwP2I98jZGAHC90o1puo+wqtWp9LzEWxhuPqNcRSSJThccDhT53qySknyR7eRVH60R1vx4+tbUw9GuEBbbd2hL/xGCMbFnHkD8O4cEFJHANdmTZJ9mnJjrKGZ7IS424klSQfKTnjIyMEfmKibzri86hhyIF3tNubnAGM5JZC0L7ZyFI2knIPPkkc+M81auxnNe18JsHX14KkjzmSROhyRRHr/FGOWt3V+uLVbYT5RGlLlXdRSjIaQ8+FBfnneRn8uK9OtJbhw0JUsBphsAqV7JSPJ/tXnDp/cWdMXV9SpCoZcYZb742upbaSottt7CMgBSycBQyD84rcBFul7hhp+4QDbHh6nYaFb30e6RkkJB8HGT58VEy4y2mnRoUns4tfxOJ10VP6hQLneuml5uq50puY/HU5DhIkFhpCCoFLZCSO4tSePUSCVYAqidJ7Ihya7fLgwZcO3hO+OypI2PlCV5VvKQtKQQrA9yPOMVs19cJvoZaaCxbbc5NYaCcguklKDt+QEqA/5jWWXbpSnUEa36k0lNiOmdGbXKaccJQ67tG5xKxnknyPGR+lVmZG0sEnBxEEEDpvt61XS4U3DcZfwB3OlaNZ9ZbZavomtPs/vl95aVO7VFtDTXlXJHKyOAnwPcjwb3bpdn1npxEhoNzbZLTyhY8EHwof0qSf1BFYfY+kdx1Ell2dNjQoTbjjDimVFx0ltakKCR+EcpPJ/sfFbhpDTFp0jZkWuxRvp4wUXFEqKlurOMrWo8qUcDn7ADAAFaITM57u8FN5LxmMxYmtbA63cyq9qO2XqzFqfY2H7u+wcNjupTI2/wDlLUogOtnnlR3JJBG7muewsXu5m7uPQ37BDmzA6lLjiFStgaQhXCCpKCpSCc7icH2PjIbh1b1ve78u02BNpt5emqiRHFsqWvlwpRvKlY+M4T+lSf7UMOepOnHnJLyrcUusPNNqUhpT2EqBUkHByArAOcYNbDntLHObrSwMOXvGxvoFy2K6XG36c0ndJ0IxhGtrDrikpUCAtCc7VEc7jxnPPNeTrfryK3p3ViLzGuNxv+pMtquBKdraEpBQjBOQncVZA4xtA8cWToPaVXOfqywNuFu23e0ub0YyhDoKUJXj5G4/nxWYXGA9BlTLRcmzGuMZZbKF+n+YOCAfvwQfB4+ahS5HeASDY6FTYMUROdG4+1obXWlxpbPcVLaWl3aghDnBVuGUknPjHx9q2/RC9By+iiHdT2uHBnMvLirdgNhMt15HqSttX4iopUknJ2+QeOKjetETTdq/c4hxQrVE2My5L7Lqu0fSMqLQ9JUvB54+fJzXT0BoqdqZxLMG3Mtx0qxJmOLcLLR8lI9Q3q8elJx8kVYY75JMn9w02r8hyHmqueGCPDHdj27rUbkbnS9PRVYuTE283M2TTUKV2pyGiYDCiVPYGR3SMApSMecJHmtQ6adGGYML+IL1qVUdxLa9v7nkpDbAAIVvdwQvHIKcbcjnNXzUOm5Gh+md8/geIl+/usELmOOJbdJPCnNxIA2JyUoGAMAAfOB6WiO2SyuxkyXWmJCEGQylZDagnkbh4J+9WPE/Jl4YxTeZ6euiq5GwwRukkNuvRvX1/i+kWdLEtyPEcVPjOPFhA2dtb7ROEEDnavOCB+Qr0z0pgNW7QtvZYS220ouOpaQ4XO0FLUe2pZAKlJ/CokDkEVgXTWfbrn1FiLnzGmLda2nJ4bWcKlOo4SB87SSrb5ykefbT/wCO3rCyI8SAzIUS9JllTpAS+6orKEEeQkqwo/OQPBrUyCKUFmG3Qc+vX3fnmpc+VkRxB3aDtSbrp4aehstdpVe0vFuGxNwuN8fuKpTYUlkR0MMNg+obEY3j49aiasNRyK0QGxYSlKVhEpSlESlKURKUpREpSlESlKURKUpREpSlEVeurCHtZWUyiFNNMSHWEE8d8bBux7kIUsD/AJlVYBiujebRCvEdtm4M91DbgdbUlakLbWPCkqSQUnk8g+5qHSl7TcyOlcyTKtMl0Mf8U4XVxnFcIO8+ooUcJwokgkc4PHv+VAbr1up6LCixC4YsZlguHcstthO8/Jx5rLOpOuoCbs/Zi6HY0ZCS6yEEpfkb+GnSfDacJUoDleQM4yDqN1ns223vS5O8ttJztQncpR8BKR7knAA+TXnnq7o7UjcIaplRhKeeS47c24ytxjJ3HtgJA9SUN7UqUMklJUeOa24wYX3Jso2QZWs4o1Y9MXSddb84i8yXJ6hGwFqSlPb2q4J2gYzuP64qP6jt6dtLEqY7bfrr1NyW0LKg2wkDG5O3B3E/c/8Az39CauRcumMd1q3RjNCvpnHmglP8tGB3VY5yog4HuQT81zWo2253+NPvbiWodoaXNO4EhRCkBOcecKIIAyScCrcG2mQCmjl68VzvdkZDWcXE52/ryVN05oeX/FCoU9Bl3O2NuqfadJcZc3NJUElJ9iHAkEHzyDV90lp+F+60S7dFF0siiQhtLqkToRB9TRcSoF3ac4JwvGAd34quml0Ln3u6X9dpkW5MppmO0JKQh91LZWS4pHlGdwACvVhAyBwKj9NOyC7dmtKw7Ym1pmqWHVqLQUtSUlW1CEcjJJ3E854qA/IMg22q/HrfrqruHFkYTwuIGvu6fXzXJp9Fq09En36VqNyTbpOxth6e6Mx2k7sM7z6lnepz8WVchJztqq6hvFlRbLjdun81yLNHqfVCjqEd9R/8wEbd/wALxn2Oao/Xp+Q3qi3Wd9ttIcH72cRF/wAPukFoKVuwckBXj86mun2mbnctPymIsmBskJStbDj6kuo+CoBJ49+PPyOaoc2Rzpe6jIrz1HlVa/LrS6fAxmNhGROdbrb2Trz0Pw/tcvRO/agna/u9vVJZkWnY5OlqLOMSFlKfQRwnJSo4xg4UfJreFZ9qp3TTQzWi4M1JlfVzZriXHnQ3sACU4ShI5OBlR5PlR8eKuVSYeLht+518vD3Kvy3RumJi/jyXlvrZo24aWvsq+W9p02eQ8ZSX2Uk/SOlW4hWPwjdyFeOce3PeuHVVnqL09e0/Gs71x1UsoCmI7BcT6TkyEEcJI+DjBPvXpUjP5VXE6RiJ1axffqHwYrBZjQkBCGGSrO9YCUglR3HySOfGcY1sxWsc4tNA8lvPaBe1okbZbsV5+0t076oaXWxqCwrgQ3XE4fhyFqcWG88hbaUkK45wk7uOOeKm5GirVq3UUifeZ6dWainBKTCjtuRYcFIGNzqgd4QgeEkhSicYOSR6KPivzPPvWyOGONoFbeK0y5kkhJOhPrzWRWjoPp63xktKuF2ewkJJ3tp/PHpJA+2eK0ebOs+lbKhct2NbreyA2hOAhI4JCUpHk8HgCpCZKahxXpMhWxhpBWtZHgAZNeReoOv7hrbUX1C4zsK0Q3CiPHeR/MQnOFLUjI/mEDwTx4+SdpljZXeu4W+ugUZsE0xPct4nef3KtHUTqG7qJTgcWYViaVlthXCnceFOfJz4SOB+fNVO+/w5cunkiTE1ApeoW5Cf/Di242lSTgbBkepXO4L8HGAPerd1L6Qi12Vu/wBnub9yjMJSt1p9KQUoIGXEEYBHvtxnBPJxznVskQbfPakzI3fS3hSSk8pI8Kx749q15naPtDFaOGM8/rp66qT2d2UOA5jjxyN1DRQ92v8AfwS76flaSuzUeTMQuUw2h0KYICW14ypII8lJyDXoXpvpL6+PEvN1ZAjqQlyPGI4XxwtQ/wAvwPfzWSWrTr3Va8wm7E6pq0Q9yZ81bSgEEkHtpyMKXj2B4zk44r1ZCjNQ4bEaOnayy2ltCfhKRgD+wr1jl2LJKyB1sdWvrzIWvM4cyGF2SypG3Y+/wBpc1KUr0tKUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiKmdX7pJtPTi9y4UlUWT20tNvIOFJK1pT6T/mwTg+Qeaov7P2r9Q3hx2zT0/X26AwD+8HlnvIJOENqPO/OFcnB9JyTUj+006pnp0wpJAaNxY7nP9OFY/8AVtrr/s8NWy2dO5V+ckIaXIdX9W84oBLaWiQlJ+PKlfms/aoTi/8AUjWgArKNrP0RJFuJ068lsldK725i7WyTBlb+y+gpUUHCk/CgfYg4IPyK8p6/1M5f9dzL1Alz4wRtjxCy+tpaWk+MbSCNyiVY+/NbG/qqf006aWc6nXIveo5G7DKngFEklRCnMHCUJKUk4JJx5zWYc5khcRoG815m7OlhDObncuauseyTnpkJ693RE1ET1NNNR+ylbmMBxz1K3KA8AYAPOPGJuW83GjOvvrDbTSSta1eEpAySf0qq6A6gWXWjJTBcVHubbfcft75AdbGcFQ9lIycbhxyM4PFT+oYJuVkmw0KAW80pKcnAz7Z+2cZ+1TWvElG9FDe1zXcLxSznTenYD8XUCobL1qix3nHIkVspHZS82h5YUMEYWSD2zwkYxg+KTpy6MxJX7ylLQ3Ct7aJskrOAGkOozj5IJBA8kjjmtQft90u8S4XDTNxjQnrm2lqZHlsFzsvIT21FJChtVgBJBCh6QR98n0zodOodbOWG8NiXbrZvXMdiuHs9wDalorwPVuJO0jwkmp0OVwxyNdodKHy/Kr5sMNyopG7C76jnr8wFsNx1lZbxo+8SbBd4cxQhuKQlh0b0kjCSU+RyR5FSCbBLgLbcsc9uKoMtsvNPsd5pzYnalQAUkpVjjIOCAOOKwCLbdPuz5l+DDGxlan4MVQ2pCSokqCRgq2pylAOBnn4xbE/tCxI97S1ddPyYlpWvYJSJAccQM8FTYH9wFEj2zVTHmtAEbzTuY8Dt965WOauXYUpc58IJj2vxG/mAdL5kGlLdTNP6fYSxcdRXmOnUilb0qKCkSGxwGQ0ncoNj2Vzgkkk5IOU6p1BeYU9q7W91y3SGGu5GUlQyhOM4I5BB90ng1+9TLozfOrE+XaXky4aocVDbzaspPpJI58EE8jgg+atsDp63rNluGNRQo7zLAS8yhla3kpPvtUU/OM8iqTM4p8wd2BYrn6+S6LBLMfC4pyaN7jQeGg/tbvpuVInaetcuclKZb8Vp15KBhIWpAKgB8ZJqSr5abS02htAwhACUj4Ar6rolyCUpSiKDvE2a/LFrsym25ZQHHpK07kxkE4B2/wBSzg4B44JPwc+6sXGV0+sMKbZG50y4y5HYVPlznFJbVgqBW3narICgEgJA+3Aqk9QdcXa1dYpkqzvSGItvDUd6IpRS1MUASoqSfsvaFf6citbl3Sx686dXJ5pTb0RcVanW3Mb47iUlQ3D2UkjIP2yOK0HLa7ijiNOCsBivhEcsg9g7/wC/RZr0lvkvWtyuNk1vdHp3dQZMVslLSSrwtOE43bfSpKeceo+wrPdfWZOmtSyLe4+684E71qdHOSTg5/qBGDk88kHJGTFaZtd91KXXNLQ5EuVCSh1a47iW1Nk/hIUSPV9gc8Gte0p0fuuoJib11PmKclHBEJh3K1gHjvODg/G1Htj1e1QGmXLx+6kGx0KtHugwcjvWGgRRCyyFrq6Tmo+mwmZdng2piDGaJWtBIIHp9wB7nwPtWs9M+iqEMPSuoEaLLfcSEtQUOFSGflS1DAUo/AyAPnPG02+1wLagpt0GLESeCGGktj/oK7gGKniG2sbIeLh2VM7KIc90TeEv3q9aXUtVthWmA1BtcRiJDaGG2WEBCE/kB9+a7dKVvUQm0pSlESlKURKUpREpSlESlKURKUpREpSlESq5q25z40mzW609puRc5So6pTqN6Y6EsrdUoJyNyiEYAPGTk5AwbHWP9fdQPWCdpR+M6lp1p96WgqPBUhKE4PyCHVA/Y1qnl7lheeSkYsByJRGOd/0q51X1lHsl2fsEKyQb6jsdm5yrqpTq1lYzsSU4xgYJxgDIAAxWa2az3C4T27RZ3Db7VMlhxMJ2Q67HZdUAkKJIJI4SAVZIz5q66ef03r2fHgttupvL7uXVtL3d3nc64r44JP6gD2rj1vfZemL7crBFLUWPEXhrtpwotKAUjJ88A7c/6aoMjLnmBkcPZul0+NiwQuEYPt1dk/PmN9lnPUCGrT2pFwoclVzcjBKZTjDJDaH0n1IRzlWMcnA5yParZ1d17bdX3u3zbWZKWGYnbLb6NpSsrJJHJByMc/apnSGlbVrC725qFJeabUnvym8ZUhIHJSr7qIGT81X9ZsWF+3P2l22qiT2HChyUlWXGnUHarA/qGQeD5GK19/8At/xppNfBbTD+7YdxPaL5Df8AHq11em1/smj+oq71eXJilIjLjssxWe4XFLIHJyAkAD3PvVoY666ktk+ZcLlGiTrWpZUmElPbWyn2ShweT87gc4PiqYNKXyRHIttvRew00MybeFOHnhJUj8SSQPHyDUx0Y0S31Dcf+ueS1b7dJxNY5DrhPhGP6QdpBPnyBz4lwSTENbHt/ah5MOMHPfLuR8P9XoqFaLVqaFC1FCFxt71yjtSVGNKcjqcSpAKe4lB2qUAcZIJ++K5UaNttvtbsfT7Ztsoh1SX2nFb3HF5JLqjkuZJySrJ+MV8XPWljtr0e1Wp2Pcbs6oMRrZBdQV5HnOOG0JAJJPgDwTgHmfc1elK3EM2IJ2KIQlx5agccYO0BX9hVywtDvZ3XOkPIsnQbWvKb8hdm1NFh3iM83HS8Y+7BUhxTPocQleMKKVJwQPkcc16I6cdO4FrWm9XGHvuSzvjtvpyYqfbj2WfJPkeB75sehdPW22aOtERhhDrSUplhTyQtReV6i5z4VknnzXze9c2qyzpESc3cEOs7RvMJ0NK3AEEObdpHPJB4wa1HAjGS6Zvj5DXU+tlNk7QmfAMVuw08SBoB63WOaojaZRre+GG86b2m4qUUR297D+5CFELVkBC0rK0kjPjkE+Kk03cZHUWyNtSHI9wVc2EBxk8oG8FYB9xsCsjwanunmhLrqbUN/ngi3w27k86085HX25AW84oFonG5IGOfuK17T/TOBb9SN32dJcm3BpRUyEp7TTaikp3bckk4J8nHPiqkYksmT3gbTb38Pj9FbHPghxDCXkurboa8vqr/AEpSr9cslKUoipHUTp7btZR0uLUYd0aSEtTEI3Hb/lWnjcn+xHsfOcusnQS9C8Fd21E3EgFJQ6LWVpefQeCglQASCPPCvjHvXoilaHY0Tn8ZGqlMzZmR9012iitN6ftem7W3b7JBZhxEf0Np5UflR8qP3PNStKVuArQKMSSbKUpSsrCUpSiJSlKIlKUoiUpSiJSlKIlKUoiUpSiJSlKIlRd709Z78GBe7XBuIYUVNCUwl0IJGDjcPfj+wqUpTdNlEWfTNisj63rNZbZbnlp2LXEiNsqUnIOCUgEjIFRWqenek9VTxOv9kjTJYbDXdUVJVtBJAJSRnyatlKxQWQ4g2Cq5pHROn9IIkI07bkwxIKe5hxayQM4AKiSByeB81U9Y9F7BqnUMq7ybheIb0oJLrUN1pDZUBjdhTajkgDPPtWn0ryY2OFEaL22aRruIONrPmrPaOk/Ti8uwnpTiGW3H1PyCFvOuEbW05Ske+1KQB7/nUBe+kr+prfHkXKfEtF3LKEOqt8ZXrCU42unuDvY+Tj+1bBTAr1wt4O7rRemzyNdxg69ViGidIs9L9SNzLwy9P+tbVFauEVklmEgepRdGMp3kJG7nwB4ya1hepLOiOHjc4akEAgNuhalZ8AJHJP2AqXxXCmJGQ+X0R2Uvny4EAKP6+azGyNjQ1oqvXNJp3Tu45NSuhpdl1ixRG321NKAUQ2ry2gqJSk/cJIH6VKkfelKy42SVqJs2gH3pSlYWEpSlESlKURKUpREpSlESlKURKUpREpSlESlKURKUpREpSlESlKURKUpREpSlESlKURKUpREpSlESlKURKUpREpSlESlKURKUpREpSlESlKURKUpREpSlESlKURKUpREpSlESlKURKUpRF//Z"}';

const MAX_NUMBER_OF_OVERLAPPING_ENTRIES = 5;
/*:: type Metadata = {
        accession: string,
        name: {name: string, short: ?string},
        source_database: string,
        type: string,
        gene?: string,
        experiment_type?: string,
        source_organism?: Object,
        release_date?: string,
        chains?: Array<string>,
        integrated?: string,
        member_databases?: Object,
        go_terms: Object,
        description: Array<string>,
        literature: Object,
        hierarchy?: Object,
        overlaps_with: Object,
        cross_references: Object,
        wikipedia: string,
      }
 */
const MemberDBSubtitle = (
  { metadata, dbInfo } /*: {metadata: Metadata, dbInfo: Object} */,
) => {
  if (
    !metadata.source_database ||
    metadata.source_database.toLowerCase() === 'interpro'
  ) {
    return null;
  }
  return (
    <table className={f('light', 'table-sum')}>
      <tbody>
        <tr>
          <td className={f('font-ml')} style={{ width: '200px' }}>
            Member database
          </td>
          <td className={f('first-letter-cap', 'md-hlight', 'font-ml')}>
            <Link
              className={f('nolink')}
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: { db: metadata.source_database },
                },
              }}
            >
              {dbInfo.name}{' '}
              <Tooltip
                title={
                  dbInfo.description || `${dbInfo.name} (${dbInfo.version})`
                }
              >
                <span
                  className={f('font-s', 'icon', 'icon-common')}
                  data-icon="&#xf129;"
                />
              </Tooltip>
            </Link>
          </td>
        </tr>
        <tr>
          <td className={f('first-letter-cap')}>{dbInfo.name} type</td>
          <td className={f('first-letter-cap')}>
            {metadata.type.replace('_', ' ').toLowerCase()}
          </td>
        </tr>
        {metadata.name.short && metadata.accession !== metadata.name.short && (
          <tr>
            <td>Short name</td>
            <td>
              <i className={f('shortname')}>{metadata.name.short}</i>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
MemberDBSubtitle.propTypes = {
  metadata: T.object.isRequired,
  dbInfo: T.object.isRequired,
};

const _SidePanel = ({ metadata, dbInfo, api, addToast }) => {
  const url = getUrlFor(metadata.source_database);
  const { protocol, hostname, port, root } = api;

  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const apiUrl = format({
    protocol,
    hostname,
    port,
    pathname: `${root}/mail/`,
  });
  const entry = `${metadata.name.name} (${metadata.accession})`;

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    data.append('subject', `Add annotation, ${entry}`);
    fetch(apiUrl, {
      method: 'POST',
      body: data,
    }).then((response) => {
      let text;
      // eslint-disable-next-line no-magic-numbers
      if (response.status === 200) {
        text = 'Thanks for your feedback';
        // eslint-disable-next-line no-magic-numbers
      } else if (response.status === 429) {
        text = 'Request aborted as too many requests are made within a minute';
      } else {
        text = 'Invalid request';
      }
      addToast(
        {
          title: text,
          ttl: 3000,
        },
        'interhelp-mail',
      );
      setMessage('');
      setEmail('');
      setOpen(false);
    });
  };

  const handleFields = (e) => {
    if (e.target.name === 'message') setMessage(e.target.value);
    else setEmail(e.target.value);
  };

  const clearFields = () => {
    setMessage('');
    setEmail('');
  };

  return (
    <div className={f('medium-4', 'large-4', 'columns')}>
      <div>
        <div
          className={f('button-group', 'dropdown-container')}
          style={{ display: 'flex' }}
        >
          <button
            className={f('button', 'dropdown')}
            onClick={() => setOpen(!isOpen)}
          >
            <Tooltip
              title={
                'You may suggest updates to the annotation of this entry using this form. Suggestions will be sent to ' +
                'our curators for review and, if acceptable, will be included in the next public release of InterPro. It is ' +
                'helpful if you can include literature references supporting your annotation suggestion.'
              }
            >
              <i className={f('icon', 'icon-common')} data-icon="&#xf303;" />{' '}
              Add your annotation
            </Tooltip>
          </button>
          <div
            className={f('dropdown-pane', 'dropdown-content')}
            style={{
              transform: `scaleY(${isOpen ? 1 : 0})`,
            }}
          >
            <form onSubmit={handleSubmit}>
              <label htmlFor="message">Your annotation</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={handleFields}
                rows="5"
                required
              />
              <label htmlFor="from_email">Email address</label>
              <input
                id="from_email"
                name="from_email"
                type="email"
                value={email}
                onChange={handleFields}
                required
              />
              <button className={f('button')}>Submit</button>
              <button className={f('button')} onClick={clearFields}>
                Clear
              </button>
            </form>
          </div>
        </div>
      </div>
      {metadata.integrated && <Integration intr={metadata.integrated} />}
      {metadata.source_database.toLowerCase() !== 'interpro' && (
        <section>
          <h5>External Links</h5>
          <ul className={f('no-bullet')}>
            <li>
              <Link
                className={f('ext')}
                target="_blank"
                href={url && url(metadata.accession)}
              >
                View {metadata.accession} in{' '}
                {(dbInfo && dbInfo.name) || metadata.source_database}
              </Link>
            </li>
            {false && // TODO: reactivate that after change in the API
              metadata.wikipedia && (
                <li>
                  <Link
                    className={f('ext')}
                    target="_blank"
                    href={`https://en.wikipedia.org/wiki/${metadata.wikipedia}`}
                  >
                    Wikipedia article
                  </Link>
                </li>
              )}
          </ul>
        </section>
      )}
      {metadata.member_databases &&
      Object.keys(metadata.member_databases).length ? (
        <ContributingSignatures contr={metadata.member_databases} />
      ) : null}
    </div>
  );
};
_SidePanel.propTypes = {
  metadata: T.object.isRequired,
  dbInfo: T.object.isRequired,
  api: T.object.isRequired,
  addToast: T.func.isRequired,
};

const mapStateToProps = createSelector(
  (state) => state.settings.api,
  (api) => ({
    api,
  }),
);

const SidePanel = connect(mapStateToProps, { addToast })(_SidePanel);

const OtherSections = ({ metadata, citations: { included, extra } }) => (
  <>
    {!Object.keys(metadata.go_terms || []).length ||
    metadata.source_database.toLowerCase() !== 'interpro' ? null : (
      <GoTerms
        terms={metadata.go_terms || []}
        type="entry"
        db={metadata.source_database}
      />
    )}
    {Object.keys(metadata.literature || []).length ? (
      <section id="references" data-testid="entry-references">
        <div className={f('row')}>
          <div className={f('large-12', 'columns')}>
            <h4>References</h4>
          </div>
        </div>
        <Literature included={included} extra={extra} />
      </section>
    ) : null}

    {Object.keys(metadata.cross_references || {}).length ? (
      <section id="cross_references" data-testid="entry-crossreferences">
        <div className={f('row')}>
          <div className={f('large-12', 'columns')}>
            <h4>Cross References</h4>
          </div>
        </div>
        <CrossReferences xRefs={metadata.cross_references} />
      </section>
    ) : null}
  </>
);
OtherSections.propTypes = {
  metadata: T.object.isRequired,
  citations: T.shape({
    included: T.array,
    extra: T.array,
  }),
};

const OverlappingEntries = ({ metadata }) => {
  const [showAllOverlappingEntries, setShowAllOverlappingEntries] = useState(
    false,
  );
  const overlaps = metadata.overlaps_with;
  if (!overlaps || Object.keys(overlaps).length === 0) return null;
  if (overlaps) {
    overlaps.sort((a, b) => {
      if (a.type > b.type) return 1;
      if (a.type < b.type) return -1;
      return a.accession > b.accession ? 1 : -1;
    });
  }

  let _overlaps = overlaps;
  if (!showAllOverlappingEntries)
    _overlaps = metadata.overlaps_with.slice(
      0,
      MAX_NUMBER_OF_OVERLAPPING_ENTRIES,
    );

  return (
    <div className={f('margin-bottom-large')}>
      <h4>
        {metadata.type === 'homologous_superfamily'
          ? 'Overlapping entries'
          : 'Overlapping homologous superfamilies'}
        <Tooltip
          title="The relationship between homologous superfamilies and other InterPro entries is calculated by analysing
          the overlap between matched sequence sets. An InterPro entry is considered related to a homologous superfamily
          if its sequence matches overlap (i.e., the match positions fall within the homologous superfamily boundaries)
          and either the Jaccard index (equivalent) or containment index (parent/child) of the matching sequence sets is greater than 0.75."
        >
          &nbsp;
          <span
            className={f('small', 'icon', 'icon-common', 'font-s')}
            data-icon="&#xf129;"
          />
        </Tooltip>
      </h4>
      {_overlaps.map((ov) => (
        <div key={ov.accession} className={f('list-items')}>
          <interpro-type type={ov.type.replace('_', ' ')} dimension="1.2em" />
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: 'InterPro',
                  accession: ov.accession,
                },
              },
            }}
          >
            {ov.name}
          </Link>{' '}
          <small>({ov.accession})</small>
        </div>
      ))}
      {Object.keys(metadata.overlaps_with || {}).length >
        MAX_NUMBER_OF_OVERLAPPING_ENTRIES && (
        <button
          className={f('button', 'hollow', 'secondary', 'margin-bottom-none')}
          onClick={() =>
            setShowAllOverlappingEntries(!showAllOverlappingEntries)
          }
        >
          Show{' '}
          {showAllOverlappingEntries ? (
            <span>
              Less{' '}
              <i
                className={f('icon', 'icon-common', 'font-sm')}
                data-icon="&#xf102;"
              />
            </span>
          ) : (
            <span>
              More{' '}
              <i
                className={f('icon', 'icon-common', 'font-sm')}
                data-icon="&#xf103;"
              />
            </span>
          )}
        </button>
      )}
    </div>
  );
};
OverlappingEntries.propTypes = {
  metadata: T.object.isRequired,
  overlaps: T.arrayOf(T.object),
};

const Hierarchy = ({ hierarchy, type, accession }) =>
  hierarchy &&
  Object.keys(hierarchy).length &&
  hierarchy.children &&
  hierarchy.children.length ? (
    <div className={f('margin-bottom-large')}>
      <h4 className={f('first-letter-cap')}>
        {type.replace('_', ' ').toLowerCase()} relationships
      </h4>
      <InterProHierarchy accession={accession} hierarchy={hierarchy} />
    </div>
  ) : null;
Hierarchy.propTypes = {
  hierarchy: T.object,
  type: T.string,
  accession: T.string,
};

/*:: type Props = {
    data: {
      metadata: Metadata,
    },
    loading: boolean,
    dbInfo: Object,
  };
*/

class SummaryEntry extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object,
    }).isRequired,
    dbInfo: T.object.isRequired,
    loading: T.bool.isRequired,
  };

  render() {
    const {
      data: { metadata },
      dbInfo,
    } = this.props;

    const wikiJson = JSON.parse(wikiText);

    if (this.props.loading || !metadata) return <Loading />;
    const citations = getLiteratureIdsFromDescription(metadata.description);
    const [included, extra] = partition(
      Object.entries(metadata.literature || {}),
      ([id]) => citations.includes(id),
    );
    const desc = (metadata.description || []).reduce((e, acc) => e + acc, '');
    included.sort((a, b) => desc.indexOf(a[0]) - desc.indexOf(b[0]));
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-8', 'large-8', 'columns')}>
              <div>
                {ReactHtmlParser(wikiJson.extract)}
                <img
                  src={`data:image/png;base64, ${wikiJson.thumbnail}`}
                  alt="Red dot"
                />
              </div>
              <MemberDBSubtitle metadata={metadata} dbInfo={dbInfo} />
              {metadata.source_database &&
                metadata.source_database.toLowerCase() === 'interpro' &&
                metadata.name.short &&
                metadata.accession !== metadata.name.short && (
                  <p data-testid="entry-shortname">
                    Short name:&nbsp;
                    <i className={f('shortname')}>{metadata.name.short}</i>
                  </p>
                )}
              <OverlappingEntries metadata={metadata} />
              <Hierarchy
                hierarchy={metadata.hierarchy}
                accession={metadata.accession}
                type={metadata.type}
              />

              {
                // doesn't work for some HAMAP as they have enpty <P> tag
                (metadata.description || []).length ? (
                  <>
                    <h4>Description</h4>
                    <Description
                      textBlocks={metadata.description}
                      literature={included}
                      accession={metadata.accession}
                    />
                  </>
                ) : null
              }
            </div>
            <SidePanel metadata={metadata} dbInfo={dbInfo} />
          </div>
        </section>
        <OtherSections metadata={metadata} citations={{ included, extra }} />
      </div>
    );
  }
}

export default SummaryEntry;
