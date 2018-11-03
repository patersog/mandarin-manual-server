const express = require('express');

const Users = require('../models/user');
const Questions = require('../models/questions');

const router = express.Router();

router.get('/:username', (req, res, next) => {
  const {
    username
  } = req.params;
  Users.findOne({
    'username': username
  })
    .select('questions.head')
    .then(result => {
      const {
        head
      } = result.questions;
      return Questions.findById({
        _id: head
      })
        .select('prompt');
    })
    .then(prompt => {
      console.log('PROMPT', prompt);
      res.json(prompt);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/correct/:username', (req, res, next) => {
  const {
    answer
  } = req.query;
  const {
    username
  } = req.params;
  Users.findOne({
    'username': username
  })
    .select('questions.head')
    .then(result => {
      const {
        head
      } = result.questions;
      return Questions.findById({
        _id: head
      })
        .select('answer');
    })
    .then(question => {
      if (question.answer === answer.toLowerCase()) {
        res.json(true);
      } else {
        res.json(false);
      }
    })
    .catch(err => {
      next(err);
    });
});

//PUT request to update our users question list
router.put('/next/:username', (req, res, next) => {
  const {
    username
  } = req.params;
  const {
    correct
  } = req.body;

  let nodeList;
  let answered;
  let answeredIndex;
  let nextQuestionIndex;
  let user;

  Users.findOne({
    'username': username
  })
    .then(result => {
      user = result;
      const {
        head,
        list
      } = user.questions;
      nodeList = list;
      return nodeList.filter((node, index) => {
        if (node.qid.toString() === head.toString()) {
          answeredIndex = index;
          return node;
        }
      });
    })
    .then(node => {

      //the answered question
      let current = node[0];
      answered = current;

      //get the pointer to the 'next' question
      nextQuestionIndex = answered.next;

      // calculate our new m value and save (did our user get the right answer?)
      answered.m = correct ? answered.m * 2 : 1;
      let m_position = answered.m;

      // if m value is larger than the number of questions, set it's position to the end
      if (m_position >= nodeList.length) {
        m_position = nodeList.length - 1;
      }

      // find the insertion point for our node
      while (m_position && current.next <= nodeList.length) {
        current = nodeList[current.next];
        m_position--;
      }
      // set the new head to be the next question qid
      user.questions.head = nodeList[nextQuestionIndex].qid;

      // update 'next' pointers for insertion
      answered.next = current.next;
      current.next = answeredIndex;

			/**
			 *
			 * 	[ a, b, c, d, e ]
			 *    1  2  3  4  0
			 *
			 *   a -> b -> c -> d -> e
			 *
			 *  [ a, b, c, d, e ]
			 *    3  2  0  4  0
			 *
			 *  b -> c -> a -> d -> e
			 *
			 *  Example List:
			 *
			 *  a -> b -> c -> d -> e
			 *  1    1    1    1    1
			 *
			 *  'a' is correctly answered, so increase m value to 2...
			 *
			 *  'b' is the next head, and insert 'a' after 'c'
			 *  b -> c -> a -> d -> e
			 *  1    1    2    1    1
			 *
			 */

      return user.save(function (err, updatedUser) {
        res.json(updatedUser.head);
        if (err) {
          next(err);
        }
      });
    })
    .catch(err => {
      next(err);
    });

});

module.exports = router;