from selenium import webdriver
import unittest

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(10) # seconds

    def test_1_page_get_feature(self):
        driver = self.driver
        driver.get("http://127.0.0.1:5000/")
        driver.find_element_by_xpath('//h3[text()="Submitted Features"]')
        driver.get_screenshot_as_file("/Users/jamie/Documents/Images/5000-List.png")

    def test_2_page_create_feature(self):
        driver = self.driver
        driver.get("http://127.0.0.1:5000/")
        driver.find_element_by_xpath('//h3[text()="Submitted Features"]')
        driver.get_screenshot_as_file("/Users/jamie/Documents/Images/5001-List.png")
        driver.find_element_by_id("addButton").click()
        driver.find_element_by_id("inputTitle").send_keys("Selenium Test")
        driver.find_element_by_id("inputTargetDate").send_keys("11/11/2019")
        driver.get_screenshot_as_file("/Users/jamie/Documents/Images/5002-Create.png")
        driver.find_element_by_id("saveButton").click()
        new_row = driver.find_element_by_xpath('//span[text()="Selenium Test"]')
        driver.get_screenshot_as_file("/Users/jamie/Documents/Images/5003-List.png")
        self.assertTrue(new_row != None)

    def test_3_page_update_feature(self):
        driver = self.driver
        driver.get("http://127.0.0.1:5000/")
        driver.find_element_by_xpath('//h3[text()="Submitted Features"]')
        driver.get_screenshot_as_file("/Users/jamie/Documents/Images/5003-List.png")
        driver.find_element_by_xpath('//tr[td/span/text()="Selenium Test"]/td/a[@id="editButton"]').click()
        inputElement = driver.find_element_by_id("inputTitle")
        self.assertIn(inputElement.get_attribute("value"),"Selenium Test")
        driver.get_screenshot_as_file("/Users/jamie/Documents/Images/5004-Update.png")
        inputElement.clear()
        inputElement.send_keys("Selenium Test 2")
        driver.find_element_by_id("inputTargetDate").send_keys("11/11/2019")
        driver.find_element_by_id("saveButton").click()
        edit_row = driver.find_element_by_xpath('//span[text()="Selenium Test 2"]')
        driver.get_screenshot_as_file("/Users/jamie/Documents/Images/5005-List.png")
        self.assertTrue(edit_row != None)

    def test_4_page_delete_feature(self):
        driver = self.driver
        driver.get("http://127.0.0.1:5000/")
        driver.find_element_by_xpath('//h3[text()="Submitted Features"]')
        driver.get_screenshot_as_file("/Users/jamie/Documents/Images/5006-List.png")
        driver.find_element_by_xpath('//tr[td/span/text()="Selenium Test 2"]/td/a[@id="deleteButton"]').click()
        driver.get_screenshot_as_file("/Users/jamie/Documents/Images/5007-Delete.png")
        delete_row_count = len(driver.find_elements_by_xpath('//span[text()="Selenium Test 2"]'))
        driver.get_screenshot_as_file("/Users/jamie/Documents/Images/5008-List.png")
        self.assertTrue(delete_row_count < 1)

    def tearDown(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()