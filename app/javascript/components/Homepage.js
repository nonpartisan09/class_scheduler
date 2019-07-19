import React, { Component } from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaComments,
  FaPeopleCarry,
  FaInbox,
  FaAward,
  FaWrench,
  FaCaretDown,
  FaCheck,
  FaRegDotCircle,
  FaRegCircle
} from 'react-icons/fa';
import {
  MdTouchApp,
} from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import {
  Fab,
  Card,
  CardContent,
  CardHeader,
  TextField,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core';
import {
  Link
} from 'react-router-dom';

import SliderButton from './reusable/withStyles/StyledSliderButton';
import {
  ENGLISH,
  SPANISH
} from './utils/availableLocales';
import formatLink from './utils/Link';

class Homepage extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSignUpScroll = this.handleSignUpScroll.bind(this);

    this.joinUsFormRef = React.createRef();

    this.state = {
      languageChecked: ENGLISH,
      signUpType: 'client',
    };
  }

  handleSelect(event, stateToChange) {
    const newValue = event.currentTarget.value;
    this.setState({ [stateToChange]: newValue });
  }

  handleSignUpScroll() {
    window.scrollTo(0, this.joinUsFormRef.current.offsetTop);
  }

  render() {
    return (
      <div className='homepageMainContainer'>
        { this.renderSplash() }
        { this.renderFeaturedPrograms() }
        { this.renderHowItWorks() }
        { this.renderWhereWeAre() }
        { this.renderJoinUs() }
      </div>
    );
  }

  renderSplash() {
    return(
      <div className='splashContainer'>
        <h1 className='spashHeader'>
          Connect and share with our community of clients and volunteers
        </h1>
        <p>
          We&apos;re an all-volunteer team inspired by the impact of free tutoring in our local communities. We&apos;ve seen the challenges in meeting people who need our help or arranging where and when to meet. Our clients would say the same thing.
        </p>
        <p className='orangeText'>
          If you have any questions, please email or call us. We will be glad to help you!
        </p>
        { this.renderContactButtons() }
        <Fab
          className='signUpButton'
          variant='extended'
          onClick={ this.handleSignUpScroll }
          >
          <FormattedMessage
            id='SignUp'
            defaultMessage='Sign Up'
          />
        </Fab>
      </div>
    );
  }

  renderContactButtons() {
    const phoneNumber = '+1-202-555-0159';
    const email = 'admin@tutoria.io';
    const size = 30;

    return(
      <div className='homepageContact'>
        <SliderButton
          to={ 'tel:'+phoneNumber }
        >
          <FaPhone
            size={ size }
            label={ (
              <FormattedMessage
                id="UserForm.phoneNumber"
                defaultMessage="Phone Number"
              />
            ) }
          />
          { phoneNumber }
        </SliderButton>
        <SliderButton
          to={ 'mailto:'+email }
        >
          <FaEnvelope
            size={ size }
            label={ (
              <FormattedMessage
                id="UserForm.email"
                defaultMessage="Email address"
              />
            ) }
          />
          { email }
        </SliderButton>
      </div>
    );
  }

  renderFeaturedPrograms() {
    const programs = [
      {
        program: 'English',
        description: 'Our English language program helps connect you with English speakers'
      },
      {
        program: 'Citizenship',
        description: 'Our citizenship program helps you through the process of applying for citizenship'
      },
      {
        program: 'Job Interview',
        description: 'Our Job Interview program helps you to prepare for job interviews'
      },
    ];
    return(
      <div className='featuredProgramsContainer'>
        <h2 className='featuredProgramsHeader'>
          Featured Programs
        </h2>
        <p className='featuredProgramsSubtitle'>
          Below are our featured programs!
        </p>
        <div className='programCardsContainer'>
          { this.renderProgramCards(programs) }
        </div>
      </div>
    );
  }

  renderProgramCards(content) {
    const size = 40;
    let cards = [];

    content.forEach(element => {
      cards.push(
        <div key={ 'programCard'+element.program } className={ 'programCard'+element.program }>
          <Card className={ element.program+'card' }>
            <CardHeader
              avatar={
                <FaComments size={ size } />
              }
            />
            <CardContent>
              <h2 className='programCardsHeader'>
                { element.program }
              </h2>
              <p className='programCardsText'>
                { element.description }
              </p>
            </CardContent>
          </Card>
        </div>
      );
    });
    return cards;
  }

  renderHowItWorks() {
    const size = 60;
    const howItWorksStages = [
      {
        icon: (<MdTouchApp size={ size } />),
        title: 'clientPost',
        description: 'Clients post what they need help with, such as English language tutoring.'
      },
      {
        icon: (<FaPeopleCarry size={ size } />),
        title: 'volunteerPost',
        description: 'Volunteers post what they can help with.'
      },
      {
        icon: (<FaInbox size={ size } />),
        title: 'contact',
        description: 'Clients contact volunteers matching their needs and availability.'
      },
      {
        icon: (<FaAward size={ size } />),
        title: 'review',
        description: 'After working together, volunteers and clients review each other.'
      },
    ];
    return(
      <div className='howItWorksContainer'>
        <h2 className='howItWorksHeader'>
          How it Works
        </h2>
        <p className='howItWorksSubtitle'>
          The stages of an avarage interaction are shown below!
        </p>
        <div className='howItWorksCardsContainer'>
          { this.renderHowItWorksCards(howItWorksStages) }
        </div>
      </div>
    );
  }

  renderHowItWorksCards(content) {
    let cards = [];

    content.forEach((element, index) => {
      cards.push(
        <div key={ 'programCard'+element.title } className={ 'programCard'+element.title }>
          <Card className={ element.title+'card' }>
            <CardContent>
              <span className='cardContent'>
                <span className='cardTextSpan'>
                  <span className='cardIcon'>
                    { element.icon }
                  </span>
                  <p>
                    { element.description }
                  </p>
                </span>
                <span className='cardIndexSpan'>
                  { index+1 }
                </span>
              </span>
            </CardContent>
          </Card>
        </div>
      );
    });
    return cards;
  }

  renderWhereWeAre() {
    const size = 60;
    return(
      <div className='whereWeAreContainer'>
        <h2 className='whereWeAreHeader'>
          Where we Are
        </h2>
        <p className='whereWeAreSubtitle'>
          The map below shows the spread of our clients across the country
        </p>
        <div className='whereWeAreMapContainer'>
          <p>
            Content coming soon!
          </p>
          <FaWrench size={ size } />
        </div>
      </div>
    );
  }

  renderJoinUs() {
    return(
      <div className='joinUsContainer' ref={ this.joinUsFormRef }>
        <h2 className='joinUsHeader'>
          Join Us
        </h2>
        <p className='joinUsSubtitle'>
          Just fill out the form below to get started!
        </p>
        <div className='joinUsFormContainer'>
          { this.renderJoinUsForm() }
        </div>
      </div>
    );
  }

  renderJoinUsForm() {
    const size = 30;
    return(
      <span className='joinUsForm'>
        <TextField
          id='standard-full-width'
          placeholder='Your email'
          fullWidth
        />
        <TextField
          id='standard-full-width'
          placeholder='Your first name'
          fullWidth
        />
        <span className='expansionPanel'>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={ <FaCaretDown /> }>
              <p className='languageSelectorTitle'>
                Website & Notification Language
              </p>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <span className='languageButtonsContainer'>
                <Button
                  className={
                    this.state.languageChecked === ENGLISH
                    ?
                    'checked'
                    :
                    'languageButton'
                  }
                  value={ ENGLISH }
                  disabled={ this.state.languageChecked === ENGLISH }
                  disableRipple
                  onClick={  (event) => this.handleSelect(event, 'languageChecked')  }
                >
                  <p>
                    English
                  </p>
                  { this.state.languageChecked === ENGLISH ? <FaCheck size={ size } /> : '' }
                </Button>
                <Button 
                  className={
                    this.state.languageChecked === SPANISH
                    ?
                    'checked'
                    :
                    'languageButton'
                  }
                  value={ SPANISH }
                  disabled={ this.state.languageChecked === SPANISH }
                  disableRipple
                  onClick={  (event) => this.handleSelect(event, 'languageChecked')  }
                >
                  <p>
                    Español
                  </p>
                  { this.state.languageChecked === SPANISH ? <FaCheck size={ size } /> : '' }
                </Button>
              </span>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </span>
        <span className='radioButtons'>
          <RadioGroup
            name='signUpTypeRadio'
            onChange={ (event) => this.handleSelect(event, 'signUpType') }
          >
            <FormControlLabel
              value="client"
              control={ (
                <Radio
                  icon={ <FaRegCircle className='radioButtonCircle' size={ size } /> }
                  checkedIcon={ <FaRegDotCircle className='radioButtonCheckedCircle' size={ size } /> }
                />
              ) }
              label="Client"
              checked={ this.state.signUpType === 'client' }
            />
            <FormControlLabel
              value="volunteer"
              control={ (
                <Radio
                  icon={ <FaRegCircle className='radioButtonCircle' size={ size } /> }
                  checkedIcon={ <FaRegDotCircle className='radioButtonCheckedCircle' size={ size } /> }
                />
              ) }
              label="Volunteer"
              checked={ this.state.signUpType === 'volunteer' }
            />
          </RadioGroup>
        </span>
        <span className='submitButtonContainer'>
          <Fab
            className='submitButton'
            variant='extended'
            component={ Link }
            to={ formatLink('/sign_up/client', this.state.languageChecked) }
            >
            <FormattedMessage
              id='Submit'
              defaultMessage='Submit'
            />
          </Fab>
        </span>
      </span>
    );
  }
}

export default Homepage;


