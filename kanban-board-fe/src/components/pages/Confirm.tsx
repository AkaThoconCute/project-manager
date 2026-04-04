import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { confirmEmail, resendEmail } from '../../redux/actions/userActions';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import InfoIcon from '@mui/icons-material/Info';
import Loader from '../Loader';
import Helmet from '../Helmet';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  margin: '25vh auto 0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontSize: '3.5em',
  padding: 10,
  '& h4, & h6': {
    margin: 0,
    textAlign: 'center',
  },
  '& h6': {
    color: '#fff',
    fontWeight: 100,
    fontSize: '1.2rem',
    textAlign: 'center',
  },
  '& h4': {
    color: '#fff',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2em',
    },
  },
}));

const Confirm = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const { loading, error, success } = useAppSelector(
    (state) => state.userEmailConfirm
  );
  const {
    loading: resendLoading,
    error: resendError,
    success: resendSuccess,
  } = useAppSelector((state) => state.userEmailResend);
  const { userInfo } = useAppSelector((state) => state.userLogin);

  useEffect(() => {
    if (id) {
      dispatch(confirmEmail(id));
    }
  }, [dispatch, id]);

  return (
    <Container>
      <Helmet title='Confirm Email' />
      {loading ? (
        <Loader />
      ) : resendSuccess ? (
        <>
          <InfoIcon color='primary' sx={{ fontSize: '7rem' }} />
          <h6 style={{ maxWidth: 500 }}>
            New confirmation email has been sent to you. It may take up to a few
            minutes for it to arrive
          </h6>
        </>
      ) : success ? (
        <>
          <DoneOutlineIcon sx={{ fontSize: '10rem', color: '#fff' }} />
          <h6 style={{ maxWidth: 500 }}>
            Your registration is complete.{' '}
            {userInfo
              ? "Start a new project if you haven't already!"
              : 'Log in with your account details and start a new project!'}
          </h6>
          {userInfo ? (
            <Link
              to='/signin'
              style={{ textDecoration: 'none', marginTop: 10, fontSize: 0 }}
            >
              <Button variant='outlined' color='primary' size='large'>
                Sign In
              </Button>
            </Link>
          ) : (
            <Link
              to='/boards'
              style={{ textDecoration: 'none', marginTop: 10, fontSize: 0 }}
            >
              <Button variant='outlined' color='primary' size='large'>
                Boards
              </Button>
            </Link>
          )}
        </>
      ) : resendError ? (
        <>
          <h4>Something went wrong</h4>
          <h6 style={{ maxWidth: 500, color: '#ff7d7d' }}>Try again later</h6>
        </>
      ) : (
        error && (
          <>
            <h4>Something went wrong</h4>
            <h6 style={{ maxWidth: 500, color: '#ff7d7d' }}>{error}</h6>
            {error !==
              "Your link is broken, make sure that it's entered correctly" &&
              id && (
                <Button
                  color='primary'
                  onClick={() => dispatch(resendEmail(id))}
                  disabled={resendLoading}
                  sx={{
                    marginTop: '10px',
                    borderColor: resendLoading ? '#ccc' : undefined,
                    color: resendLoading ? '#ccc' : undefined,
                  }}
                  variant='outlined'
                  size='large'
                >
                  Resend
                  {resendLoading && <Loader button />}
                </Button>
              )}
          </>
        )
      )}
    </Container>
  );
};

export default Confirm;
