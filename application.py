from flask import Flask, render_template, request, json, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

## Comment out the line below if you want to work with a RDS account. Keep it as is for a local DB.
SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/test2.db'

## Edit the URI below to add your MySQL database RDS credentials and your AWS URL
## SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://(user):(password)@(db_endpoint)/(db_name)'

SQLALCHEMY_TRACK_MODIFICATIONS = False
WTF_CSRF_ENABLED = True
DEBUG = True

WTF_CSRF_ENABLED = True
SECRET_KEY = 'dsaf0897sfdg45sfdgfdsaqzdf98sdf0a'

application = Flask(__name__)
application.config.from_object(__name__)
db = SQLAlchemy(application)

class Feature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    priority = db.Column(db.Integer, nullable=False)
    target_date = db.Column(db.Date, nullable=False)
    client = db.Column(db.String(5), nullable=False)
    product_area = db.Column(db.String(20), nullable=False)
    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    def __repr__(self):
        return '<Feature %r>' % self.title

def init_db():
    with application.app_context():
        db.create_all()

@application.route("/")
def main():
    return render_template('features.html')

@application.route('/features/', defaults={'feature_id': None}, methods=['GET'])
@application.route('/features/<int:feature_id>', methods=['GET'])
def get_feature(feature_id):
    if feature_id:
        entries = []
        features = Feature.query.filter_by(id=feature_id)
        for u in features:
            entries.append(u.as_dict())
        return jsonify(features=entries )
    else: 
        entries = []
        features = Feature.query.order_by('priority').all()
        for u in features:
            entries.append(u.as_dict())
        return jsonify(features=entries )

@application.route('/features', methods=['POST'])
def save_feature():
    # read the posted values from the UI
    id = request.form['id']
    if id == '':
        id = None
    title = request.form['title']
    description = request.form['description']
    client = request.form['client']
    priority = int(request.form['priority'])
    rawTarget = request.form['target']
    target = datetime.strptime(rawTarget, '%Y-%m-%d')
    area = request.form['area']

    # validate the received values
    if id:
        with db.session.no_autoflush:
            edit_feature = Feature.query.filter_by(id=id).first()
            if edit_feature is None:
                return json.dumps({'html':'<span>Item not found to update.</span>'})
            edit_feature.title=title
            edit_feature.description=description
            edit_feature.priority=priority
            edit_feature.target_date=target
            edit_feature.client=client
            edit_feature.product_area=area
            update_priority(client,priority)
            db.session.commit()
            return json.dumps({'html':'<span>All good</span>'})

    # validate the received values
    elif title:
        new_feature = Feature(
            id=id,
            title=title,
            description=description,
            priority=priority,
            target_date=target,
            client=client,
            product_area=area
        )
        db.session.add(new_feature)
        update_priority(client,priority)
        db.session.commit()
        return json.dumps({'html':'<span>All good</span>'})
    else:
        return json.dumps({'html':'<span>Enter the required fields</span>'})

# two features cannot have the same priority, re-order if same priority is added
def update_priority(client,priority):
    with db.session.no_autoflush:
        priority_to_update = priority
        features_to_update_count = Feature.query.filter_by(client=client, priority=priority_to_update).count()
        while features_to_update_count > 1:
            feature_to_update = Feature.query.filter_by(client=client, priority=priority_to_update).order_by('id').first()
            feature_to_update.priority = feature_to_update.priority + 1
            priority_to_update = priority_to_update + 1
            features_to_update_count = Feature.query.filter_by(client=client, priority=priority_to_update).count()

@application.route('/features/<int:feature_id>', methods=['DELETE'])
def delete_feature(feature_id):
    if feature_id:
        feature_to_delete = Feature.query.get(feature_id)
        db.session.delete(feature_to_delete)
        db.session.commit()
        return json.dumps({'html':'<span>All good</span>'})
    else:
        return json.dumps({'html':'<span>Enter the required fields</span>'})

if __name__ == "__main__":
    init_db()
    application.run()