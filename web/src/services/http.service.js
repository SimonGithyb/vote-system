import axios from 'axios';
import router from '@/router';

import config from '@/config';
import { useSnackbarStore } from '@/stores/snackbar';

class httpService {
    accessToken = localStorage.getItem('accessToken');

    async login(email, password) {
        return await axios.post(`${config.API_URL}/auth/login`, {
            email: email,
            password: password,
        }, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(res => {
            if ( res.data.error) {
                this.errorHandlingWithoutAuth(res);
                return;
            }
            this.successSnackbar(res.message || 'Login with success!');
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.RefreshToken);
            localStorage.setItem('session', true);
            location.reload();
            return;
        })
        .catch(err => {
            this.errorHandlingWithoutAuth(err);
        });
    }

    async signup(signupData) {
        return await axios.post(`${config.API_URL}/auth/signup`, {
                name: signupData.name,
                surname: signupData.surname,
                email: signupData.email,
                password: signupData.password,
            }, {
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                },
                validateStatus: () => true
            })
        .then(res => {
            if ( res.data.error) {
                this.errorHandlingWithoutAuth(res);
                return;
            }

            this.successSnackbar(res.message || 'Signup with success!');
            router.push('/login')
            return;
        })
        .catch(err => {
            this.errorHandlingWithoutAuth(err);
        });
    }

    async createNewVote(newVote) {
      await axios.post(`${config.API_URL}/vote`, {
        name: newVote.voteName,
        type: newVote.voteType,
        questions: JSON.stringify(newVote.questions),
        userId: newVote.userId,
        expiryDate: Date.parse(newVote.voteExpiry),
        publicResults: newVote.publicResults,
      }, {
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.accessToken,
          }
      })
      .then(res => {
        if ( res.data.error) {
            this.errorHandlingWithoutAuth(res);
            return;
        }

        
        this.successSnackbar(res.message || 'Create new vote with success!');

        return;
      })
      .catch(err => {
        console.error(err);

        this.snackMessage =  err.response.data.errorDetails.message || err.message;
        this.snackbar = true;
        if (err.response.statusText === 'Unauthorized') {
          localStorage.clear();
          location.reload();
        }
      });
    }

    async getVotes(userId, lastRecordId, paginatorCurrentRow) {
        return await axios.get(`${config.API_URL}/vote/getVote/${userId}/${lastRecordId}/${paginatorCurrentRow}`, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.accessToken,
            }
        })
        .then(res => {
            if ( res.data.error) {
                this.errorHandlingWithoutAuth(res);
                return;
            }
    
            this.successSnackbar(res.data.message || 'Get data succesful!');
            return res.data;
        })
        .catch(err => {
            this.errorHandlingWithAuth(err);
        });
    }

    async getVoteByActive(active) {
        return await axios.get(`${config.API_URL}/vote/getVotes/${active}`, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('accessToken'),
            }
        })
        .then(res => {

            if ( res.data.error) {
                this.errorHandlingWithoutAuth(res);
                    return;
            }

            this.successSnackbar(res.message || 'data is coming!');
            return res.data;
        })
        .catch(err => {
            this.errorHandlingWithAuth(err);
        });
    }

    async getVoteWithoutSession(active) {
        return await axios.get(`${config.API_URL}/vote/getVotesNoSession/${active}`, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then(res => {
          if ( res.data.error) {
                this.errorHandlingWithoutAuth(res);
                return;
          }
            this.successSnackbar(res.message || 'Get data with success!');
            return res.data;
        })
        .catch(err => {
            this.errorHandlingWithAuth(err);
        });
    }

    async getVoteSize(userId) {
      return await axios.get(`${config.API_URL}/vote/getVoteSize/${userId}`, {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.accessToken,
        }
      })
      .then(res => {

          if ( res.data.error) {
            this.errorHandlingWithoutAuth(res);
            return;
        }
        this.successSnackbar(res.message);
        return res.data;
      })
      .catch(err => {
        this.errorHandlingWithAuth(err);
      });
    }

    async saveVoteCast(answers) {
        return await axios.post(`${config.API_URL}/vote/saveVoteCast`, {
            answers: answers.answers,
            voteId: answers.voteId,
            userId: answers.userId,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
          }
      })
      .then(res => {
        if ( res.data.error) {
            this.errorHandlingWithoutAuth(res);
            return;
        }
        this.successSnackbar(res.message || 'save answers with success!');
        return;
      })
      .catch(err => {
        this.errorHandlingWithoutAuth(err);
      });
    }

    async getVoteResult(voteId, userId) {
        return await axios.get(`${config.API_URL}/vote/voteResults/${voteId}/${userId}`, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.accessToken,
            }
        })
        .then(res => {

            if ( res.data.error) {
                this.errorHandlingWithoutAuth(res);
                return;
            }
            this.successSnackbar(res.message || 'Get vote results with success!');
            return res.data.data;
            })
        .catch(err => {
            this.errorHandlingWithAuth(err);
        });
    }

    async deleteVote(id) {
        await axios.delete(`${config.API_URL}/vote/${id}`, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.accessToken,
            }
        })
        .then(res => {
            if ( res.data.error) {
                this.errorHandlingWithoutAuth(res);
                return;
        }
        this.successSnackbar(res || "Delete with success!");
        return;
        })
        .catch(err => {
            this.errorHandlingWithAuth(err)
        });
    }

    async saveEditVote(voteId, editedVote) {

      await axios.put(`${config.API_URL}/vote/${voteId}`, {
          name: editedVote.voteName,
          type: editedVote.voteType,
          questions: JSON.stringify(editedVote.questions),
          userId: editedVote.userId,
          expiryDate: Date.parse(editedVote.voteExpiry),
        }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.accessToken,
        },
      })
      .then(res => {

          if ( res.data.error) {
            this.errorHandlingWithoutAuth(res);
            return;
        }
        this.successSnackbar(res || 'Edit with success!')
        return;
      })
      .catch(err => {
        this.errorHandlingWithAuth(err);
      });
    }

    errorHandlingWithoutAuth(err) {
        const snackbar = useSnackbarStore();
        snackbar.show(err?.data?.errorDetails?.message,  {type: 'error'});
    }

    errorHandlingWithAuth(err) {
        const snackbar = useSnackbarStore();
        snackbar.show(err?.response?.data?.errorDetails?.message, {type: 'error'});

        if (err.response.statusText === 'Unauthorized') {
          localStorage.clear();
          location.reload();
        }
    }

    successSnackbar(res) {
        console.log(res)
        if ( res === undefined)
            return;
        const snackbar = useSnackbarStore();
        snackbar.show(res?.data?.message || res, {type: 'success'});
    }

}

export default new httpService();
