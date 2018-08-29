from application import application
import unittest

class FlaskTestCase(unittest.TestCase):

  def test_create_feature(self):
    tester = application.test_client(self)
    response = tester.post(
      '/features',
      data = dict(
        id="", 
        title="Test Feature", 
        description="Test Description", 
        client="1", 
        priority="1", 
        target="2019-08-30", 
        area="Billings"),
        follow_redirects=True
      )
    self.assertIn(b'All good', response.data)

  def test_update_feature(self):
    tester = application.test_client(self)
    response = tester.post(
      '/features',
      data = dict(
        id="7", 
        title="Test Feature 2", 
        description="Test Description 2", 
        client="1", 
        priority="1", 
        target="2019-08-30", 
        area="Billings"),
        follow_redirects=True
      )
    self.assertIn(b'All good', response.data)

  def test_get_feature(self):
    tester = application.test_client(self)
    response = tester.get('/features/')
    self.assertIn(b'description', response.data)

if __name__ == '__main__':
    unittest.main()