#######################################################################
# Copyright 2012 Mark Wolf
#
# This file is part of OrgWolf.
#
# OrgWolf is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#######################################################################

"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from __future__ import unicode_literals
from django.test import TestCase
from django.test.client import Client
from django.utils.timezone import get_current_timezone
from GettingThingsDone.models import Node, TodoState, Project
from projects.forms import NodeForm
from orgwolf.models import OrgWolfUser as User
import datetime
import re

class EditNode(TestCase):
    def setUp(self):
        """
        Creates a node in order to test editing functions
        """
        dummy_user = User(username='test')
        dummy_user.set_password('secret')
        dummy_user.save()
        actionable = TodoState(abbreviation='ACTN',
                               display_text='Action',
                               actionable=True,
                               closed=False,
                               owner=dummy_user,
                               system_default=True)
        actionable.save()
        closed = TodoState(abbreviation='DONE',
                           display_text='Completed',
                           actionable=False,
                           closed=True,
                           owner=dummy_user,
                           system_default=True)
        closed.save()
        node = Node(owner=dummy_user,
                    order=10,
                    title='Buy cat food',
                    todo_state=actionable)
        node.save()
        project = Project(title='Errands',
                          owner=dummy_user)
        project.save()    
             
    def close_node_through_client(self, client, project, node=None):
        """
        Helper function that uses the client to edit a node
        and set it to a closed state. If the optional /node/
        argument is passed then that node is edited, otherwise
        a new node is created.
        """
        closed_todo = TodoState.objects.get(abbreviation='DONE')
        self.assertTrue(closed_todo.closed)
        post_data = {'scheduled': '',
                     'priority': '',
                     'project': project.id,
                     'deadline': '',
                     'todo_state': closed_todo.id}
        if node: # existing node
            url = '/projects/' + str(node.id) + '/edit/'
            regex = re.compile('http://testserver/projects/' + str(node.id))
            post_data['title'] = node.title
        else: # new node
            url = '/projects/1/new/'
            regex = re.compile('http://testserver/projects/1/')
            post_data['title'] = 'new node 1'
        response = client.post(url, post_data, follow=True)
        self.assertEqual(200, response.status_code)
        redirect = re.match("http://testserver/projects/(\d+)/",
                            response.redirect_chain[0][0])
        self.assertTrue(redirect.group()) # Did the redirect match
        self.assertEqual(302, response.redirect_chain[0][1])
        return redirect.groups()[0]
                  
    def test_close_timestamp(self):
        """
        Test that the "closed" timestamp is set automatically."
        """
        now = datetime.datetime.utcnow()
        client = Client()
        # Login
        self.assertTrue(
            client.login(username='test', password='secret')
            )
        node = Node.objects.get(title='Buy cat food')
        # print node.todo_state.closed
        project = Project.objects.get(title='Errands')
        # Make sure it's not closed first
        self.assertFalse(node.todo_state.closed)
        # Edit the node through the client
        self.close_node_through_client(client, project, node)
        # Refresh the node
        new_node = Node.objects.get(title='Buy cat food')
        # Make sure the node is closed
        self.assertTrue(new_node.todo_state.closed)
        self.assertEqual(now.date(), new_node.closed.date())

        # Same thing if it has no initial todostate
        node = Node.objects.get(title='Buy cat food')
        node.todo_state = None
        node.save()
        self.assertEqual(None, node.todo_state)
        # Now run the request
        self.close_node_through_client(client, project, node)
        # Refresh the node
        new_node = Node.objects.get(title='Buy cat food')
        # Make sure the node is closed
        self.assertTrue(new_node.todo_state.closed)
        self.assertEqual(now.date(), new_node.closed.date())

        # Test that closed is set for new nodes
        new_node_id = self.close_node_through_client(client, project)
        new_node = Node.objects.get(id=new_node_id)
        # Make sure the node is closed
        self.assertTrue(new_node.todo_state.closed)
        self.assertEqual(now.date(), new_node.closed.date())
