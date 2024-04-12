import React from 'react';
import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';
import local from './styles.css';
const css = cssBinder(local);

const EBIFooter = () => {
  const year: string = new Date().getFullYear().toString();
  return (
    <div className="vf-footer">
      <div className="vf-footer__inner">
        <p className="vf-footer__notice">
          <Link
            className="vf-footer__link"
            href="//www.ebi.ac.uk/about/our-impact"
          >
            EMBL-EBI is the home for big data in biology.
          </Link>
        </p>
        <p className="vf-footer__notice">
          We help scientists exploit complex information to make discoveries
          that benefit humankind.
        </p>
        <div className="vf-footer__links-group | vf-grid">
          <div className="vf-links">
            <h4 className="vf-links__heading">
              <Link
                className="vf-heading__link"
                href="//www.ebi.ac.uk/services"
              >
                Services
              </Link>
            </h4>
            <ul className="vf-links__list | vf-list">
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/services/data-resources-and-tools"
                  className="vf-list__link"
                >
                  Data resources and tools
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/submission"
                  className="vf-list__link"
                >
                  Data submission
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link href="//www.ebi.ac.uk/support" className="vf-list__link">
                  Support and feedback
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/licencing"
                  className="vf-list__link"
                >
                  Licensing
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/long-term-data-preservation"
                  className="vf-list__link"
                >
                  Long-term data preservation
                </Link>
              </li>
            </ul>
          </div>

          <div className="vf-links">
            <h4 className="vf-links__heading">
              <Link
                className="vf-heading__link"
                href="//www.ebi.ac.uk/research"
              >
                Research
              </Link>
            </h4>
            <ul className="vf-links__list | vf-list">
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/research/publications"
                  className="vf-list__link"
                >
                  Publications
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/research/groups"
                  className="vf-list__link"
                >
                  Research groups
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/research/postdocs"
                  className="vf-list__link"
                >
                  Postdocs
                </Link>{' '}
                and{' '}
                <Link
                  href="//www.ebi.ac.uk/research/eipp"
                  className="vf-list__link"
                >
                  PhDs
                </Link>
              </li>
            </ul>
          </div>

          <div className="vf-links">
            <h4 className="vf-links__heading">
              <Link
                className="vf-heading__link"
                href="//www.ebi.ac.uk/training"
              >
                Training
              </Link>
            </h4>
            <ul className="vf-links__list | vf-list">
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/training/live-events"
                  className="vf-list__link"
                >
                  Live training
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/training/on-demand"
                  className="vf-list__link"
                >
                  On-demand training
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/training/trainer-support"
                  className="vf-list__link"
                >
                  Support for trainers
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/training/contact-us"
                  className="vf-list__link"
                >
                  Contact organisers
                </Link>
              </li>
            </ul>
          </div>

          <div className="vf-links">
            <h4 className="vf-links__heading">
              <Link
                className="vf-heading__link"
                href="//www.ebi.ac.uk/industry"
              >
                Industry
              </Link>
            </h4>
            <ul className="vf-links__list | vf-list">
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/industry/private/members-area/"
                  className="vf-list__link"
                >
                  Members Area
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/industry/contact-us"
                  className="vf-list__link"
                >
                  Contact Industry team
                </Link>
              </li>
            </ul>
          </div>

          <div className="vf-links">
            <h4 className="vf-links__heading">
              <Link className="vf-heading__link" href="//www.ebi.ac.uk/about">
                About
              </Link>
            </h4>
            <ul className="vf-links__list | vf-list">
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/about/contact"
                  className="vf-list__link"
                >
                  Contact us
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/about/events"
                  className="vf-list__link"
                >
                  Events
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/about/jobs"
                  className="vf-list__link"
                >
                  Jobs
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/about/news"
                  className="vf-list__link"
                >
                  News
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link
                  href="//www.ebi.ac.uk/about/people"
                  className="vf-list__link"
                >
                  People and groups
                </Link>
              </li>
              <li className={css('vf-list__item', 'vf-footer__notice')}>
                <Link href="//intranet.ebi.ac.uk" className="vf-list__link">
                  Intranet for staff
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="vf-footer__legal">
          <span className="vf-footer__legal-text">
            <Link
              className="vf-footer__link"
              href="//www.google.co.uk/maps/place/Hinxton,+Saffron+Walden+CB10+1SD/@52.0815334,0.1891518,17z/data=!3m1!4b1!4m5!3m4!1s0x47d87ccbfbd2538b:0x7bbdb4cde2779ff3!8m2!3d52.0800838!4d0.186415"
            >
              EMBL-EBI, Wellcome Genome Campus, Hinxton, Cambridgeshire, CB10
              1SD, UK.
            </Link>
          </span>
          <span className="vf-footer__legal-text">
            <Link className="vf-footer__link" href="tel:00441223494444">
              Tel: +44 (0)1223 49 44 44
            </Link>
          </span>
          <span className="vf-footer__legal-text">
            <Link
              className="vf-footer__link"
              href="//www.ebi.ac.uk/about/contact"
            >
              Full contact details
            </Link>
          </span>
        </p>
        <p className="vf-footer__legal">
          <span className="vf-footer__legal-text">
            Copyright &copy; EMBL {year}
          </span>
          <span className="vf-footer__legal-text">
            EMBL-EBI is part of the{' '}
            <Link className="vf-footer__link" href="//www.embl.org">
              European Molecular Biology Laboratory
            </Link>
          </span>
          <span className="vf-footer__legal-text">
            <Link
              className="vf-footer__link"
              href="//www.ebi.ac.uk/about/terms-of-use"
            >
              Terms of use
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default EBIFooter;
